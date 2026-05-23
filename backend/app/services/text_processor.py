from typing import List
from pathlib import Path
import re
from pypdf import PdfReader
from docx import Document as DocxDocument
from app.core.config import settings

class TextProcessor:
    def __init__(self):
        self.chunk_size = settings.CHUNK_SIZE
        self.chunk_overlap = settings.CHUNK_OVERLAP

    def extract_text(self, file_path: Path, file_ext: str) -> str:
        if file_ext == ".pdf":
            return self._extract_from_pdf(file_path)
        elif file_ext == ".docx":
            return self._extract_from_docx(file_path)
        elif file_ext == ".txt":
            return self._extract_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_ext}")

    def _extract_from_pdf(self, file_path: Path) -> str:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()

    def _extract_from_docx(self, file_path: Path) -> str:
        doc = DocxDocument(file_path)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text.strip()

    def _extract_from_txt(self, file_path: Path) -> str:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read().strip()

    def chunk_text(self, text: str) -> List[str]:
        sentences = self._split_into_sentences(text)
        chunks = []
        current_chunk = []
        current_length = 0

        for sentence in sentences:
            sentence_length = len(sentence)
            
            if current_length + sentence_length > self.chunk_size and current_chunk:
                chunk_text = " ".join(current_chunk)
                chunks.append(chunk_text)
                
                overlap_text = chunk_text[-self.chunk_overlap:] if len(chunk_text) > self.chunk_overlap else chunk_text
                current_chunk = [overlap_text]
                current_length = len(overlap_text)
            
            current_chunk.append(sentence)
            current_length += sentence_length

        if current_chunk:
            chunks.append(" ".join(current_chunk))

        return chunks

    def _split_into_sentences(self, text: str) -> List[str]:
        text = re.sub(r'\s+', ' ', text)
        
        sentence_endings = r'[.!?؟]\s+'
        sentences = re.split(sentence_endings, text)
        
        sentences = [s.strip() for s in sentences if s.strip()]
        
        return sentences
