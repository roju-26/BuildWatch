"""Central configuration for the BuildWatch AI module.
Every tunable AI value lives HERE. Change it here (or via .env), nowhere else.
"""
import os
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]

try:  # optional: lets you keep settings in the repo-root .env file
    from dotenv import load_dotenv
    load_dotenv(REPO_ROOT / ".env")
except ImportError:
    pass


def _resolve(path_str: str) -> Path:
    """Relative paths are resolved from the repo root, so it works from any folder."""
    p = Path(path_str)
    return p if p.is_absolute() else (REPO_ROOT / p).resolve()


def _env_bool(name: str, default: bool = False) -> bool:
    return os.getenv(name, str(default)).strip().lower() in ("1", "true", "yes", "on")


# ---- Shared setting (name fixed by master prompt, section 23) ----
AI_MODEL_PATH = _resolve(os.getenv("AI_MODEL_PATH", "ai/models/best.pt"))

# ---- AI-only settings ----
# Development switch: returns a fixed fake detection so backend/frontend can
# integrate before real weights exist. MUST be false for any real evaluation/demo.
AI_MOCK_MODE = _env_bool("AI_MOCK_MODE", False)

DETECTION_CONF_THRESHOLD = float(os.getenv("DETECTION_CONF_THRESHOLD", "0.25"))
DETECTION_IMAGE_SIZE = 640

# Image similarity (used for duplicate detection support and before/after)
SIMILARITY_SIZE = (256, 256)
SIMILARITY_WEIGHTS = {"ssim": 0.4, "histogram": 0.3, "orb": 0.3}  # must sum to 1.0
ORB_MATCH_SCALE = 2.0  # [DECISION REQUIRED] calibrate with real photos

# Before/after removal rules: compare detected-debris coverage (fraction of image)
# [DECISION REQUIRED] proposed defaults, calibrate with real before/after pairs
REMOVED_COVERAGE_RATIO = 0.2    # after <= 20% of before  -> REMOVED
EXPANDED_COVERAGE_RATIO = 1.3   # after >= 130% of before -> EXPANDED