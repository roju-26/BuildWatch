"""YOLO debris detector. The model is loaded lazily (first use) so importing
this module does not slow down backend startup."""
import logging
from typing import Any, Dict, List

import numpy as np

from ai.config import (
    AI_MOCK_MODE,
    AI_MODEL_PATH,
    DETECTION_CONF_THRESHOLD,
    DETECTION_IMAGE_SIZE,
)
from ai.errors import ModelNotFoundError
from ai.inference.constants import to_official_category

logger = logging.getLogger(__name__)

_model = None
_mock_warned = False


def _get_model():
    global _model
    if _model is None:
        if not AI_MODEL_PATH.is_file():
            raise ModelNotFoundError(
                f"YOLO weights not found at {AI_MODEL_PATH}. "
                "Train/copy best.pt there, or set AI_MOCK_MODE=true for development."
            )
        from ultralytics import YOLO  # imported here on purpose (lazy)
        _model = YOLO(str(AI_MODEL_PATH))
        logger.info("Loaded YOLO model from %s", AI_MODEL_PATH)
    return _model


def _mock_detections(image: np.ndarray) -> List[Dict[str, Any]]:
    global _mock_warned
    if not _mock_warned:
        logger.warning("AI_MOCK_MODE is ON: returning FAKE detections. Not for evaluation.")
        _mock_warned = True
    h, w = image.shape[:2]
    return [{
        "category": "RUBBLE",
        "confidence": 0.9,
        "bbox": [int(w * 0.25), int(h * 0.30), int(w * 0.75), int(h * 0.80)],
    }]


def detect_debris(image: np.ndarray) -> List[Dict[str, Any]]:
    """Run YOLO on a BGR image array.
    Returns [{"category": str, "confidence": float, "bbox": [x1, y1, x2, y2]}, ...]
    sorted by confidence (highest first). bbox is in ORIGINAL image pixels."""
    if AI_MOCK_MODE:
        return _mock_detections(image)

    model = _get_model()
    result = model.predict(
        source=image,
        conf=DETECTION_CONF_THRESHOLD,
        imgsz=DETECTION_IMAGE_SIZE,
        verbose=False,
    )[0]

    detections = []
    for box in result.boxes:
        raw_name = result.names[int(box.cls[0])]
        x1, y1, x2, y2 = [int(round(v)) for v in box.xyxy[0].tolist()]
        detections.append({
            "category": to_official_category(raw_name),
            "confidence": round(float(box.conf[0]), 4),
            "bbox": [x1, y1, x2, y2],
        })
    detections.sort(key=lambda d: d["confidence"], reverse=True)
    return detections