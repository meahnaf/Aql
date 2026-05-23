from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class SearchResult(BaseModel):
    document_id: UUID
    document_name: str
    chunk_index: int
    content: str
    score: float
    language: str

class SearchRequest(BaseModel):
    query: str
    language: Optional[str] = None
    limit: int = 10

class SearchResponse(BaseModel):
    results: List[SearchResult]
    total: int
    query: str
