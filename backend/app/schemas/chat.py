from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class Citation(BaseModel):
    document_id: UUID
    document_name: str
    chunk_index: int
    content: str
    score: float

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    conversation_history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]
    language: str
