"""Before/after comparison (persistence and removal verification).
The result is a SUGGESTION. The administrator verifies the real-world outcome."""
from pathlib import Path
from typing import Any, Dict, List, Union

import numpy as np

from ai.config import EXPANDED_COVERAGE_RATIO, REMOVED_COVERAGE_RATIO
from ai.inference.constants import REMOVAL_EXPANDED, REMOVAL_REMAINS, REMOVAL_REMOVED
from ai.inference.detector import detect_debris
from ai.inference.result_formatter import format_result
from ai.preprocessing.image_utils import load_image
from ai.similarity.image_similarity import compute_image_similarity

PathLike = Union[str, Path]


def debris_coverage(detections: List[Dict[str, Any]], image_shape) -> float:
    """Fraction of the image covered by detected debris boxes (overlaps counted once)."""
    h, w = image_shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)
    for d in detections:
        x1, y1, x2, y2 = d["bbox"]
        mask[max(0, y1):max(0, y2), max(0, x1):max(0, x2)] = 1
    return float(mask.sum()) / float(h * w)


def classify_removal(before_coverage: float, after_coverage: float) -> str:
    # Conservative: with no debris found in the "before" photo we cannot
    # claim anything was removed, so a human must decide.
    if before_coverage <= 0:
        return REMOVAL_REMAINS
    ratio = after_coverage / before_coverage
    if ratio <= REMOVED_COVERAGE_RATIO:
        return REMOVAL_REMOVED
    if ratio >= EXPANDED_COVERAGE_RATIO:
        return REMOVAL_EXPANDED
    return REMOVAL_REMAINS


def compare_before_after(before_path: PathLike, after_path: PathLike) -> Dict[str, Any]:
    """Compare original and follow-up evidence. Returns the standard AI result dict:
    detections / primary_category / confidence come from the AFTER image,
    image_similarity is before-vs-after, removal_status is REMAINS|EXPANDED|REMOVED."""
    before = load_image(before_path)
    after = load_image(after_path)
    before_det = detect_debris(before)
    after_det = detect_debris(after)
    status = classify_removal(
        debris_coverage(before_det, before.shape),
        debris_coverage(after_det, after.shape),
    )
    similarity = compute_image_similarity(before, after)
    return format_result(after_det, image_similarity=similarity, removal_status=status)