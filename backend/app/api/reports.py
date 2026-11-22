from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas.case import Case, HistoryItem

router = APIRouter(prefix="/reports", tags=["reports"])

_now = datetime.now(timezone.utc)

# TEMPORARY in-memory data. Will be replaced by real database queries.
# Sample coordinates are demo values only.
_CASES = [
    {
        "case_id": "BW-2026-00001",
        "reporter_role": "CITIZEN",
        "description": "Sample: rubble on the road",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "public_area_type": "ROAD",
        "image": "https://example.com/sample.jpg",
        "detected_debris": [{"category": "RUBBLE", "confidence": 0.91}],
        "severity": 3,
        "status": "REPORTED",
        "created_at": _now,
        "updated_at": _now,
        "follow_ups": [],
    }
]

_HISTORY = {
    "BW-2026-00001": [
        {"status": "REPORTED", "changed_at": _now, "note": "Report submitted"}
    ]
}


@router.get("", response_model=List[Case])
def list_reports():
    return _CASES


@router.get("/{case_id}", response_model=Case)
def get_report(case_id: str):
    for c in _CASES:
        if c["case_id"] == case_id:
            return c
    raise HTTPException(status_code=404, detail="Case not found")


@router.get("/{case_id}/history", response_model=List[HistoryItem])
def get_history(case_id: str):
    if case_id not in _HISTORY:
        raise HTTPException(status_code=404, detail="Case not found")
    return _HISTORY[case_id]
