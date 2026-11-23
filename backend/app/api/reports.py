from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.enums import CaseStatus, PublicAreaType, Role
from app.schemas.case import Case, HistoryItem, StatusUpdate
from app.services.case_id import generate_case_id
from app.services.status_flow import is_allowed
from app.utils.image_storage import save_image

router = APIRouter(prefix="/reports", tags=["reports"])


def _follow_ups(db: Session, case_id: str):
    rows = db.execute(
        text(
            "SELECT file_path, uploaded_at, note, removal_status, image_similarity "
            "FROM case_images WHERE case_id = :c AND image_type = 'FOLLOW_UP' ORDER BY id"
        ),
        {"c": case_id},
    ).mappings().all()
    return [
        {
            "image": r["file_path"],
            "created_at": r["uploaded_at"],
            "note": r["note"] or "",
            "removal_status": r["removal_status"] or "REMAINS",
            "image_similarity": r["image_similarity"] or 0.0,
        }
        for r in rows
    ]


def _debris(db: Session, case_id: str):
    rows = db.execute(
        text(
            "SELECT d.category, d.confidence FROM detections d "
            "JOIN case_images i ON i.id = d.image_id "
            "WHERE i.case_id = :c AND i.image_type = 'ORIGINAL'"
        ),
        {"c": case_id},
    ).mappings().all()
    return [{"category": r["category"], "confidence": r["confidence"]} for r in rows]


def _build_case(db: Session, row) -> dict:
    case = dict(row)
    image = db.execute(
        text(
            "SELECT file_path FROM case_images "
            "WHERE case_id = :c AND image_type = 'ORIGINAL' ORDER BY id LIMIT 1"
        ),
        {"c": case["case_id"]},
    ).scalar()
    case["image"] = image or ""
    case["detected_debris"] = _debris(db, case["case_id"])
    case["follow_ups"] = _follow_ups(db, case["case_id"])
    return case


_CASE_COLUMNS = (
    "case_id, reporter_role, description, latitude, longitude, "
    "public_area_type, severity, status, created_at, updated_at"
)


@router.get("", response_model=List[Case])
def list_reports(db: Session = Depends(get_db)):
    rows = db.execute(
        text(f"SELECT {_CASE_COLUMNS} FROM cases ORDER BY created_at DESC")
    ).mappings().all()
    return [_build_case(db, r) for r in rows]


@router.get("/{case_id}", response_model=Case)
def get_report(case_id: str, db: Session = Depends(get_db)):
    row = db.execute(
        text(f"SELECT {_CASE_COLUMNS} FROM cases WHERE case_id = :c"),
        {"c": case_id},
    ).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Case not found")
    return _build_case(db, row)


@router.get("/{case_id}/history", response_model=List[HistoryItem])
def get_history(case_id: str, db: Session = Depends(get_db)):
    exists = db.execute(
        text("SELECT 1 FROM cases WHERE case_id = :c"), {"c": case_id}
    ).scalar()
    if not exists:
        raise HTTPException(status_code=404, detail="Case not found")
    rows = db.execute(
        text(
            "SELECT new_status AS status, changed_at, note "
            "FROM status_history WHERE case_id = :c ORDER BY id"
        ),
        {"c": case_id},
    ).mappings().all()
    return [{"status": r["status"], "changed_at": r["changed_at"], "note": r["note"] or ""} for r in rows]


@router.post("", response_model=Case, status_code=201)
def create_report(
    image: UploadFile = File(...),
    description: str = Form(""),
    latitude: float = Form(...),
    longitude: float = Form(...),
    public_area_type: PublicAreaType = Form(...),
    reporter_role: Role = Form(...),
    db: Session = Depends(get_db),
):
    filename = save_image(image)
    case_id = generate_case_id(db)
    db.execute(
        text(
            "INSERT INTO cases (case_id, reporter_role, description, latitude, longitude, "
            "location, public_area_type, severity, status) VALUES "
            "(:id, :role, :desc, :lat, :lng, "
            "ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :area, 1, 'REPORTED')"
        ),
        {
            "id": case_id,
            "role": reporter_role.value,
            "desc": description,
            "lat": latitude,
            "lng": longitude,
            "area": public_area_type.value,
        },
    )
    db.execute(
        text(
            "INSERT INTO case_images (case_id, image_type, file_path) "
            "VALUES (:c, 'ORIGINAL', :p)"
        ),
        {"c": case_id, "p": f"/uploads/{filename}"},
    )
    db.execute(
        text(
            "INSERT INTO status_history (case_id, old_status, new_status, note) "
            "VALUES (:c, NULL, 'REPORTED', 'Report submitted')"
        ),
        {"c": case_id},
    )
    db.commit()
    return get_report(case_id, db)


@router.put("/{case_id}/status", response_model=Case)
def update_status(case_id: str, body: StatusUpdate, db: Session = Depends(get_db)):
    current_value = db.execute(
        text("SELECT status FROM cases WHERE case_id = :c"), {"c": case_id}
    ).scalar()
    if not current_value:
        raise HTTPException(status_code=404, detail="Case not found")
    current = CaseStatus(current_value)
    if not is_allowed(current, body.status):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change status from {current.value} to {body.status.value}",
        )
    db.execute(
        text("UPDATE cases SET status = :s, updated_at = now() WHERE case_id = :c"),
        {"s": body.status.value, "c": case_id},
    )
    db.execute(
        text(
            "INSERT INTO status_history (case_id, old_status, new_status, note) "
            "VALUES (:c, :o, :n, :note)"
        ),
        {"c": case_id, "o": current.value, "n": body.status.value, "note": body.note},
    )
    db.commit()
    return get_report(case_id, db)
