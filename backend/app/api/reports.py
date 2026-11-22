from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas.case import Case, HistoryItem

router = APIRouter(prefix="/reports", tags=["reports"])

_now = datetime.now(timezone.utc)

# TEMPORARY in-memory data. Will be replaced by real database queries.
# Sample coordinates are demo values only.
_CASES = []
_HISTORY = {}


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


from fastapi import File, Form, UploadFile

from app.enums import CaseStatus, PublicAreaType, Role
from app.services.case_id import generate_case_id
from app.utils.image_storage import save_image


@router.post("", response_model=Case, status_code=201)
def create_report(
    image: UploadFile = File(...),
    description: str = Form(""),
    latitude: float = Form(...),
    longitude: float = Form(...),
    public_area_type: PublicAreaType = Form(...),
    reporter_role: Role = Form(...),
):
    filename = save_image(image)
    now = datetime.now(timezone.utc)
    case_id = generate_case_id()
    new_case = {
        "case_id": case_id,
        "reporter_role": reporter_role.value,
        "description": description,
        "latitude": latitude,
        "longitude": longitude,
        "public_area_type": public_area_type.value,
        "image": f"/uploads/{filename}",
        "detected_debris": [],  # filled by the AI module later
        "severity": 1,  # the real severity is calculated later, in one place
        "status": CaseStatus.REPORTED.value,
        "created_at": now,
        "updated_at": now,
        "follow_ups": [],
    }
    _CASES.append(new_case)
    _HISTORY[case_id] = [
        {"status": "REPORTED", "changed_at": now, "note": "Report submitted"}
    ]
    return new_case


from fastapi import File, Form, UploadFile

from app.enums import CaseStatus, PublicAreaType, Role
from app.services.case_id import generate_case_id
from app.utils.image_storage import save_image


@router.post("", response_model=Case, status_code=201)
def create_report(
    image: UploadFile = File(...),
    description: str = Form(""),
    latitude: float = Form(...),
    longitude: float = Form(...),
    public_area_type: PublicAreaType = Form(...),
    reporter_role: Role = Form(...),
):
    filename = save_image(image)
    now = datetime.now(timezone.utc)
    case_id = generate_case_id()
    new_case = {
        "case_id": case_id,
        "reporter_role": reporter_role.value,
        "description": description,
        "latitude": latitude,
        "longitude": longitude,
        "public_area_type": public_area_type.value,
        "image": f"/uploads/{filename}",
        "detected_debris": [],  # filled by the AI module later
        "severity": 1,  # the real severity is calculated later, in one place
        "status": CaseStatus.REPORTED.value,
        "created_at": now,
        "updated_at": now,
        "follow_ups": [],
    }
    _CASES.append(new_case)
    _HISTORY[case_id] = [
        {"status": "REPORTED", "changed_at": now, "note": "Report submitted"}
    ]
    return new_case


from fastapi import File, Form, UploadFile

from app.enums import CaseStatus, PublicAreaType, Role
from app.services.case_id import generate_case_id
from app.utils.image_storage import save_image


@router.post("", response_model=Case, status_code=201)
def create_report(
    image: UploadFile = File(...),
    description: str = Form(""),
    latitude: float = Form(...),
    longitude: float = Form(...),
    public_area_type: PublicAreaType = Form(...),
    reporter_role: Role = Form(...),
):
    filename = save_image(image)
    now = datetime.now(timezone.utc)
    case_id = generate_case_id()
    new_case = {
        "case_id": case_id,
        "reporter_role": reporter_role.value,
        "description": description,
        "latitude": latitude,
        "longitude": longitude,
        "public_area_type": public_area_type.value,
        "image": f"/uploads/{filename}",
        "detected_debris": [],  # filled by the AI module later
        "severity": 1,  # the real severity is calculated later, in one place
        "status": CaseStatus.REPORTED.value,
        "created_at": now,
        "updated_at": now,
        "follow_ups": [],
    }
    _CASES.append(new_case)
    _HISTORY[case_id] = [
        {"status": "REPORTED", "changed_at": now, "note": "Report submitted"}
    ]
    return new_case

