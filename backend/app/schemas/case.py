from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.enums import (
    CaseStatus,
    DebrisCategory,
    PublicAreaType,
    RemovalStatus,
    Role,
)


class DetectedDebris(BaseModel):
    category: DebrisCategory
    confidence: float = Field(ge=0.0, le=1.0)


class FollowUp(BaseModel):
    image: str
    created_at: datetime
    note: str = ""
    removal_status: RemovalStatus
    image_similarity: float = Field(ge=0.0, le=1.0)


class Case(BaseModel):
    case_id: str
    reporter_role: Role
    description: Optional[str] = None
    latitude: float
    longitude: float
    public_area_type: PublicAreaType
    image: str
    detected_debris: List[DetectedDebris] = []
    severity: int = Field(ge=1, le=4)
    status: CaseStatus
    created_at: datetime
    updated_at: datetime
    follow_ups: List[FollowUp] = []


class HistoryItem(BaseModel):
    status: CaseStatus
    changed_at: datetime
    note: str = ""


class StatusUpdate(BaseModel):
    status: CaseStatus
    note: str = ""


class VerifyRequest(BaseModel):
    verified: bool = True
    note: str = ""


class Hotspot(BaseModel):
    latitude: float
    longitude: float
    case_count: int
    max_severity: int
