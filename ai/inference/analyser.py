"""PUBLIC AI INTERFACE for new reports and duplicate checks (the backend calls this)."""
from pathlib import Path
from typing import Any, Dict, Union

from ai.inference.detector import detect_debris
from ai.inference.result_formatter import format_result
from ai.preprocessing.image_utils import load_image
from ai.similarity.image_similarity import compute_image_similarity

PathLike = Union[str, Path]


def analyze_image(image_path: PathLike) -> Dict[str, Any]:
    """Detect construction debris in one image. Returns the standard AI result dict
    (removal_status is "" and image_similarity is 0.0 for a single image)."""
    image = load_image(image_path)
    return format_result(detect_debris(image))


def compute_similarity(image_path_a: PathLike, image_path_b: PathLike) -> float:
    """Similarity (0.0 to 1.0) between two images. Backend uses it for duplicate checks."""
    return compute_image_similarity(load_image(image_path_a), load_image(image_path_b))