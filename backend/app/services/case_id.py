from datetime import datetime, timezone

from sqlalchemy import text
from sqlalchemy.orm import Session


def generate_case_id(db: Session) -> str:
    """Next case ID like BW-2026-00001. The counter lives in the case_counters table.
    The caller must commit the session."""
    year = datetime.now(timezone.utc).year
    number = db.execute(
        text(
            "INSERT INTO case_counters (year, last_number) VALUES (:y, 1) "
            "ON CONFLICT (year) DO UPDATE SET last_number = case_counters.last_number + 1 "
            "RETURNING last_number"
        ),
        {"y": year},
    ).scalar()
    return f"BW-{year}-{number:05d}"
