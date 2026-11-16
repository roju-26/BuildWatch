from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/buildwatch"
    SECRET_KEY: str = "change-me"
    IMAGE_UPLOAD_PATH: str = "./uploads"
    AI_MODEL_PATH: str = "../ai_module/models/best.pt"
    LOCATION_THRESHOLD: float = 30.0
    IMAGE_SIMILARITY_THRESHOLD: float = 0.75

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
