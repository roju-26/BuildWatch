"""Image loading and preprocessing helpers (OpenCV)."""
from pathlib import Path

import cv2
import numpy as np

from ai.errors import ImageLoadError


def load_image(image_path) -> np.ndarray:
    """Load an image as a BGR numpy array. Raises ImageLoadError on any problem.
    Uses imdecode so paths with spaces/non-ASCII characters also work on Windows."""
    path = Path(image_path)
    if not path.is_file():
        raise ImageLoadError(f"Image not found: {path}")
    data = np.fromfile(str(path), dtype=np.uint8)
    if data.size == 0:
        raise ImageLoadError(f"Image file is empty: {path}")
    image = cv2.imdecode(data, cv2.IMREAD_COLOR)
    if image is None:
        raise ImageLoadError(f"Could not decode image: {path}")
    return image


def resize_fixed(image: np.ndarray, size) -> np.ndarray:
    """Resize to a fixed (width, height)."""
    return cv2.resize(image, size, interpolation=cv2.INTER_AREA)


def normalize_lighting(image: np.ndarray) -> np.ndarray:
    """CLAHE on the lightness channel: reduces the effect of different lighting
    between the original and follow-up photographs."""
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    merged = cv2.merge((clahe.apply(l_channel), a_channel, b_channel))
    return cv2.cvtColor(merged, cv2.COLOR_LAB2BGR)