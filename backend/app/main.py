from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import reports

app = FastAPI(title="BuildWatch API")

# Allow the React frontend (Vite dev server) to call this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reports.router)


@app.get("/health")
def health():
    return {"status": "ok"}
