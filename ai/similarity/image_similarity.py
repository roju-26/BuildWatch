"""Image similarity for duplicate-detection support and before/after comparison.
Returns a single score from 0.0 (different) to 1.0 (identical).
The AI only REPORTS similarity. The backend decides what counts as a duplicate."""
import cv2
import numpy as np
from skimage.metrics import structural_similarity

from ai.config import ORB_MATCH_SCALE, SIMILARITY_SIZE, SIMILARITY_WEIGHTS
from ai.preprocessing.image_utils import normalize_lighting, resize_fixed


def _clamp01(value: float) -> float:
    if value != value:  # NaN guard
        return 0.0
    return float(max(0.0, min(1.0, value)))


def _ssim_score(a: np.ndarray, b: np.ndarray) -> float:
    """Structure similarity (scikit-image). Sensitive to camera angle."""
    gray_a = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)
    gray_b = cv2.cvtColor(b, cv2.COLOR_BGR2GRAY)
    return _clamp01(structural_similarity(gray_a, gray_b))


def _histogram_score(a: np.ndarray, b: np.ndarray) -> float:
    """Colour-distribution similarity (OpenCV). Tolerant to small angle changes."""
    hists = []
    for img in (a, b):
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        hist = cv2.calcHist([hsv], [0, 1], None, [30, 32], [0, 180, 0, 256])
        cv2.normalize(hist, hist, 0, 1, cv2.NORM_MINMAX)
        hists.append(hist)
    return _clamp01(cv2.compareHist(hists[0], hists[1], cv2.HISTCMP_CORREL))


def _orb_score(a: np.ndarray, b: np.ndarray) -> float:
    """Local feature matching (ORB). Most robust to angle/zoom differences."""
    orb = cv2.ORB_create(nfeatures=500)
    kp_a, des_a = orb.detectAndCompute(cv2.cvtColor(a, cv2.COLOR_BGR2GRAY), None)
    kp_b, des_b = orb.detectAndCompute(cv2.cvtColor(b, cv2.COLOR_BGR2GRAY), None)
    if des_a is None or des_b is None or len(kp_a) < 2 or len(kp_b) < 2:
        return 0.0
    pairs = cv2.BFMatcher(cv2.NORM_HAMMING).knnMatch(des_a, des_b, k=2)
    good = sum(
        1 for pair in pairs
        if len(pair) == 2 and pair[0].distance < 0.75 * pair[1].distance  # Lowe ratio test
    )
    ratio = good / max(1, min(len(kp_a), len(kp_b)))
    return _clamp01(ratio * ORB_MATCH_SCALE)


def compute_image_similarity(image_a: np.ndarray, image_b: np.ndarray) -> float:
    """Weighted similarity of two BGR image arrays, in [0.0, 1.0]."""
    a = normalize_lighting(resize_fixed(image_a, SIMILARITY_SIZE))
    b = normalize_lighting(resize_fixed(image_b, SIMILARITY_SIZE))
    w = SIMILARITY_WEIGHTS
    score = (
        w["ssim"] * _ssim_score(a, b)
        + w["histogram"] * _histogram_score(a, b)
        + w["orb"] * _orb_score(a, b)
    )
    return round(_clamp01(score), 4)