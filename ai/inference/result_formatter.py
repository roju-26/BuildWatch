"""Builds the AI result dict exactly as defined in master prompt sections 12 and 13.
EVERY public AI function returns its result through format_result()."""
from typing import Any, Dict, List

from ai.inference.constants import UNKNOWN_CATEGORY


def format_result(
    detections: List[Dict[str, Any]],
    image_similarity: float = 0.0,
    removal_status: str = "",
) -> Dict[str, Any]:
    if detections:
        top = max(detections, key=lambda d: d["confidence"])
        primary_category, confidence = top["category"], top["confidence"]
    else:
        primary_category, confidence = UNKNOWN_CATEGORY, 0.0

    return {
        "detections": detections,
        "primary_category": primary_category,
        "confidence": confidence,
        "severity": 0,          # placeholder: the BACKEND is the only severity authority
        "affected_area": "",    # [DECISION REQUIRED] who sets the public area
        "image_similarity": round(float(image_similarity), 4),
        "removal_status": removal_status,   # "" unless a before/after comparison was run
    }