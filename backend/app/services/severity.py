from typing import Optional

from app.enums import SEVERITY_MAX, SEVERITY_MIN

# [DECISION REQUIRED] These weights are proposals. Confirm them with the team.
SEVERITY_WEIGHTS = {
    "METAL_RODS": 3.0,
    "RUBBLE": 3.0,
    "BRICKS": 2.0,
    "CEMENT_BAGS": 2.0,
    "SAND": 1.0,
}
DEFAULT_CATEGORY_WEIGHT = 2.0  # used when the category is not known yet

AREA_MULTIPLIERS = {
    "DRAIN": 1.5,
    "ROAD": 1.25,
    "FOOTPATH": 1.0,
}


def calculate_severity(category: Optional[str], public_area_type: str) -> int:
    """Returns 1 (LOW) to 4 (CRITICAL). The only severity formula in the project."""
    weight = SEVERITY_WEIGHTS.get(category or "", DEFAULT_CATEGORY_WEIGHT)
    multiplier = AREA_MULTIPLIERS.get(public_area_type, 1.0)
    score = weight * multiplier
    if score >= 4:
        level = 4
    elif score >= 3:
        level = 3
    elif score >= 2:
        level = 2
    else:
        level = 1
    return max(SEVERITY_MIN, min(SEVERITY_MAX, level))
