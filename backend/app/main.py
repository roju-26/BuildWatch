from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
from fastapi.staticfiles import StaticFiles
from app.api import reports
from app.config import settings

app = FastAPI(title="BuildWatch API")

# Allow the React frontend (Vite dev server) to call this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.IMAGE_UPLOAD_PATH, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.IMAGE_UPLOAD_PATH), name="uploads")
app.include_router(reports.router)


@app.get("/health")
def health():
    return {"status": "ok"}

