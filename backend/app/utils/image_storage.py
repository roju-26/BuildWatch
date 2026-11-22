import os
import uuid

from fastapi import UploadFile

from app.config import settings


def save_image(file: UploadFile) -> str:
    """Save an uploaded image in IMAGE_UPLOAD_PATH. Returns the saved file name."""
    os.makedirs(settings.IMAGE_UPLOAD_PATH, exist_ok=True)
    ext = os.path.splitext(file.filename or "")[1].lower() or ".jpg"
    name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(settings.IMAGE_UPLOAD_PATH, name)
    with open(path, "wb") as f:
        f.write(file.file.read())
    return name
