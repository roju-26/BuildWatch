from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import settings

# One engine for the whole app. DATABASE_URL comes from backend/.env
DB_URL = settings.DATABASE_URL.replace("postgresql://", "postgresql+pg8000://", 1)
import ssl
DB_URL = DB_URL.split("?")[0]
engine = create_engine(DB_URL, pool_pre_ping=True, connect_args={"ssl_context": ssl.create_default_context()})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db():
    """FastAPI dependency: gives each request its own session, then closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



