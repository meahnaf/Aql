from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any
from rank_bm25 import BM25Okapi
from app.models.document import DocumentChunk, Document
from app.schemas.search import SearchRequest, SearchResponse, SearchResult
from app.services.embedding_service import EmbeddingService

class SearchService:
    def __init__(self, db: Session):
        self.db = db
        self.embedding_service = EmbeddingService()

    async def hybrid_search(self, request: SearchRequest) -> SearchResponse:
        vector_results = await self._vector_search(request.query, request.limit)
        
        bm25_results = await self._bm25_search(request.query, request.limit)
        
        combined_results = self._combine_and_rerank(vector_results, bm25_results, request.limit)
        
        search_results = []
        for result in combined_results:
            chunk = result["chunk"]
            document = self.db.query(Document).filter(Document.id == chunk.document_id).first()
            
            search_results.append(SearchResult(
                document_id=chunk.document_id,
                document_name=document.original_filename if document else "Unknown",
                chunk_index=chunk.chunk_index,
                content=chunk.content,
                score=result["score"],
                language=document.language.value if document else "unknown"
            ))

        return SearchResponse(
            results=search_results,
            total=len(search_results),
            query=request.query
        )

    async def _vector_search(self, query: str, limit: int) -> List[Dict[str, Any]]:
        query_embedding = await self.embedding_service.generate_embedding(query)
        
        embedding_str = "[" + ",".join(map(str, query_embedding)) + "]"
        
        sql = text("""
            SELECT id, document_id, chunk_index, content, 
                   1 - (embedding <=> :embedding::vector) as similarity
            FROM document_chunks
            ORDER BY embedding <=> :embedding::vector
            LIMIT :limit
        """)
        
        result = self.db.execute(sql, {"embedding": embedding_str, "limit": limit})
        rows = result.fetchall()
        
        results = []
        for row in rows:
            chunk = self.db.query(DocumentChunk).filter(DocumentChunk.id == row[0]).first()
            if chunk:
                results.append({
                    "chunk": chunk,
                    "score": float(row[4]),
                    "type": "vector"
                })
        
        return results

    async def _bm25_search(self, query: str, limit: int) -> List[Dict[str, Any]]:
        all_chunks = self.db.query(DocumentChunk).all()
        
        if not all_chunks:
            return []
        
        corpus = [chunk.content.lower().split() for chunk in all_chunks]
        bm25 = BM25Okapi(corpus)
        
        query_tokens = query.lower().split()
        scores = bm25.get_scores(query_tokens)
        
        chunk_scores = list(zip(all_chunks, scores))
        chunk_scores.sort(key=lambda x: x[1], reverse=True)
        
        results = []
        for chunk, score in chunk_scores[:limit]:
            if score > 0:
                results.append({
                    "chunk": chunk,
                    "score": float(score),
                    "type": "bm25"
                })
        
        return results

    def _combine_and_rerank(
        self, 
        vector_results: List[Dict[str, Any]], 
        bm25_results: List[Dict[str, Any]], 
        limit: int
    ) -> List[Dict[str, Any]]:
        chunk_scores = {}
        
        for result in vector_results:
            chunk_id = result["chunk"].id
            chunk_scores[chunk_id] = {
                "chunk": result["chunk"],
                "vector_score": result["score"],
                "bm25_score": 0.0
            }
        
        for result in bm25_results:
            chunk_id = result["chunk"].id
            if chunk_id in chunk_scores:
                chunk_scores[chunk_id]["bm25_score"] = result["score"]
            else:
                chunk_scores[chunk_id] = {
                    "chunk": result["chunk"],
                    "vector_score": 0.0,
                    "bm25_score": result["score"]
                }
        
        for chunk_id in chunk_scores:
            vector_score = chunk_scores[chunk_id]["vector_score"]
            bm25_score = chunk_scores[chunk_id]["bm25_score"]
            
            combined_score = (0.6 * vector_score) + (0.4 * (bm25_score / 10.0))
            chunk_scores[chunk_id]["score"] = combined_score
        
        ranked_results = sorted(
            chunk_scores.values(),
            key=lambda x: x["score"],
            reverse=True
        )
        
        return ranked_results[:limit]
