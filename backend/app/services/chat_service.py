from sqlalchemy.orm import Session
from typing import List
from openai import AsyncOpenAI
from app.core.config import settings
from app.schemas.chat import ChatRequest, ChatResponse, Citation
from app.services.search_service import SearchService

class ChatService:
    def __init__(self, db: Session):
        self.db = db
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.search_service = SearchService(db)

    async def generate_response(self, request: ChatRequest) -> ChatResponse:
        from app.schemas.search import SearchRequest
        
        search_request = SearchRequest(
            query=request.message,
            language=request.language,
            limit=5
        )
        search_results = await self.search_service.hybrid_search(search_request)
        
        context = self._build_context(search_results.results)
        
        system_prompt = self._get_system_prompt(request.language)
        
        messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        for msg in request.conversation_history[-5:]:
            messages.append({"role": msg.role, "content": msg.content})
        
        user_message = f"""Context from documents:
{context}

User question: {request.message}

Please answer the question based on the provided context. If the context doesn't contain relevant information, say so."""
        
        messages.append({"role": "user", "content": user_message})
        
        response = await self.client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        answer = response.choices[0].message.content
        
        citations = [
            Citation(
                document_id=result.document_id,
                document_name=result.document_name,
                chunk_index=result.chunk_index,
                content=result.content[:300],
                score=result.score
            )
            for result in search_results.results[:3]
        ]
        
        return ChatResponse(
            answer=answer,
            citations=citations,
            language=request.language
        )

    def _build_context(self, results: List) -> str:
        context_parts = []
        for idx, result in enumerate(results, 1):
            context_parts.append(
                f"[Source {idx}: {result.document_name}]\n{result.content}\n"
            )
        return "\n".join(context_parts)

    def _get_system_prompt(self, language: str) -> str:
        if language == "ar":
            return """أنت مساعد ذكاء اصطناعي متخصص في الإجابة على الأسئلة بناءً على وثائق الشركة.
قدم إجابات دقيقة ومفيدة باللغة العربية. استخدم المعلومات من السياق المقدم فقط.
إذا لم تكن المعلومات متوفرة في السياق، أخبر المستخدم بذلك."""
        else:
            return """You are an AI assistant specialized in answering questions based on company documents.
Provide accurate and helpful answers in English. Use only the information from the provided context.
If the information is not available in the context, inform the user."""
