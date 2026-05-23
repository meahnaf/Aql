from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class DocumentUpload(BaseModel):
    filename: str
    language: str

class DocumentChunkResponse(BaseModel):
    id: UUID
    chunk_index: int
    content: str
    metadata: Optional[str] = None

    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: UUID
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    language: str
    created_at: datetime
    chunk_count: Optional[int] = 0

    class Config:
        from_attributes = True

class DocumentList(BaseModel):
    documents: List[DocumentResponse]
    total: int
