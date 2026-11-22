from enum import Enum


class Role(str, Enum):
    CITIZEN = "CITIZEN"
    FIELD_WORKER = "FIELD_WORKER"
    ADMINISTRATOR = "ADMINISTRATOR"


class CaseStatus(str, Enum):
    REPORTED = "REPORTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    VERIFICATION_PENDING = "VERIFICATION_PENDING"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"


class DebrisCategory(str, Enum):
    RUBBLE = "RUBBLE"
    SAND = "SAND"
    BRICKS = "BRICKS"
    CEMENT_BAGS = "CEMENT_BAGS"
    METAL_RODS = "METAL_RODS"
    UNKNOWN = "UNKNOWN"  # internal to AI only


class PublicAreaType(str, Enum):
    FOOTPATH = "FOOTPATH"
    ROAD = "ROAD"
    DRAIN = "DRAIN"


class RemovalStatus(str, Enum):
    REMAINS = "REMAINS"
    EXPANDED = "EXPANDED"
    REMOVED = "REMOVED"


# Severity scale: 1 = LOW, 2 = MEDIUM, 3 = HIGH, 4 = CRITICAL
SEVERITY_MIN = 1
SEVERITY_MAX = 4
