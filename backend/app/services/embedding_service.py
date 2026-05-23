from typing import List
from openai import AsyncOpenAI
from app.core.config import settings

class EmbeddingService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.EMBEDDING_MODEL

    async def generate_embedding(self, text: str) -> List[float]:
        text = text.replace("\n", " ").strip()
        
        if not text:
            raise ValueError("Cannot generate embedding for empty text")

        response = await self.client.embeddings.create(
            input=text,
            model=self.model
        )
        
        return response.data[0].embedding

    async def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        texts = [text.replace("\n", " ").strip() for text in texts]
        
        response = await self.client.embeddings.create(
            input=texts,
            model=self.model
        )
        
        return [item.embedding for item in response.data]
