"""AI-side mirror of the shared project vocabulary (master prompt sections 7 and 16).
Do NOT add official categories here without a team decision."""

OFFICIAL_CATEGORIES = ("RUBBLE", "SAND", "BRICKS", "CEMENT_BAGS", "METAL_RODS")
UNKNOWN_CATEGORY = "UNKNOWN"  # internal use only

REMOVAL_REMAINS = "REMAINS"
REMOVAL_EXPANDED = "EXPANDED"
REMOVAL_REMOVED = "REMOVED"

# Raw YOLO class name -> official category. If your training labels use a
# different spelling, add it HERE (one place only).
_CLASS_ALIASES = {
    "rubble": "RUBBLE",
    "sand": "SAND",
    "brick": "BRICKS", "bricks": "BRICKS",
    "cement_bag": "CEMENT_BAGS", "cement_bags": "CEMENT_BAGS",
    "metal_rod": "METAL_RODS", "metal_rods": "METAL_RODS",
}


def to_official_category(raw_name: str) -> str:
    key = raw_name.strip().lower().replace("-", "_").replace(" ", "_")
    return _CLASS_ALIASES.get(key, UNKNOWN_CATEGORY)