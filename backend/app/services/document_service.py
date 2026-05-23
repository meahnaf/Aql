from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
from pathlib import Path
from app.models.document import Document, DocumentChunk, DocumentLanguage
from app.core.config import settings
from app.services.embedding_service import EmbeddingService
from app.services.text_processor import TextProcessor

class DocumentService:
    def __init__(self, db: Session):
        self.db = db
        self.embedding_service = EmbeddingService()
        self.text_processor = TextProcessor()
        self.upload_dir = Path("uploads")
        self.upload_dir.mkdir(exist_ok=True)

    async def upload_document(self, file: UploadFile, language: str, user_id: uuid.UUID) -> Document:
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {file_ext} not allowed. Allowed: {settings.ALLOWED_EXTENSIONS}"
            )

        content = await file.read()
        file_size = len(content)
        
        if file_size > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE} bytes"
            )

        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = self.upload_dir / unique_filename
        
        with open(file_path, "wb") as f:
            f.write(content)

        text_content = self.text_processor.extract_text(file_path, file_ext)
        
        detected_language = self._detect_language(language)
        
        document = Document(
            filename=unique_filename,
            original_filename=file.filename,
            file_type=file_ext,
            file_size=file_size,
            language=detected_language,
            storage_path=str(file_path),
            uploaded_by=user_id
        )
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)

        await self._process_and_store_chunks(document, text_content)
        
        return document

    async def _process_and_store_chunks(self, document: Document, text: str):
        chunks = self.text_processor.chunk_text(text)
        
        for idx, chunk_text in enumerate(chunks):
            embedding = await self.embedding_service.generate_embedding(chunk_text)
            
            chunk = DocumentChunk(
                document_id=document.id,
                chunk_index=idx,
                content=chunk_text,
                embedding=embedding,
                metadata=f'{{"language": "{document.language}", "chunk_size": {len(chunk_text)}}}'
            )
            self.db.add(chunk)
        
        self.db.commit()

    def _detect_language(self, language: str) -> DocumentLanguage:
        if language.lower() in ["ar", "arabic"]:
            return DocumentLanguage.ARABIC
        elif language.lower() in ["en", "english"]:
            return DocumentLanguage.ENGLISH
        else:
            return DocumentLanguage.MIXED
