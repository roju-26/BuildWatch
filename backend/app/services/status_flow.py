from app.enums import CaseStatus

# Forward order of the workflow
_ORDER = [
    CaseStatus.REPORTED,
    CaseStatus.UNDER_REVIEW,
    CaseStatus.ASSIGNED,
    CaseStatus.IN_PROGRESS,
    CaseStatus.VERIFICATION_PENDING,
    CaseStatus.RESOLVED,
    CaseStatus.CLOSED,
]


def is_allowed(current: CaseStatus, new: CaseStatus) -> bool:
    """Allowed: the next step forward, or back to UNDER_REVIEW (not from CLOSED).
    [DECISION REQUIRED] confirm these rules with the team."""
    if current == CaseStatus.CLOSED:
        return False
    if new == CaseStatus.UNDER_REVIEW and current != CaseStatus.REPORTED:
        return True
    return _ORDER.index(new) == _ORDER.index(current) + 1
