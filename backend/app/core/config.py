from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    OPENAI_API_KEY: str
    AZURE_STORAGE_CONNECTION_STRING: str = ""
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    MULTILINGUAL_MODEL: str = "intfloat/multilingual-e5-large"
    
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".txt"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
