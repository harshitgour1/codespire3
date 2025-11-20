"""Query router for RAG queries."""

import logging
import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import get_tenant_id
from app.models.query import (
    QueryRequest,
    QueryResponse,
    Citation,
    TimelineItem,
    ActionItem,
)
from services.embeddings import get_embedding_service
from services.gemini_client import get_gemini_client
from services.vector_store import get_vector_store

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("", response_model=QueryResponse)
async def query(
    request: QueryRequest,
    tenant_id: Annotated[str, Depends(get_tenant_id)] = "default",
):
    """
    Main RAG query endpoint.

    Accepts a natural language query, retrieves relevant chunks, and synthesizes a response.
    """
    try:
        # Generate query embedding
        embedding_service = get_embedding_service()
        query_embedding = await embedding_service.generate_embedding(request.query)

        # Query vector store
        vector_store = get_vector_store()

        # Build filter with tenant_id
        filters = request.filters.copy()
        filters["tenant_id"] = request.tenant_id or tenant_id

        # Retrieve top-k chunks
        results = await vector_store.query(
            vector=query_embedding,
            top_k=request.top_k,
            filter=filters if filters else None,
            include_metadata=True,
        )

        # Prepare context chunks
        context_chunks = []
        for result in results:
            chunk_text = result.get("metadata", {}).get("text", "")
            if not chunk_text:
                continue

            context_chunks.append(
                {
                    "doc_id": result.get("metadata", {}).get("doc_id", result.get("id", "unknown")),
                    "chunk_id": result.get("id", "unknown"),
                    "text": chunk_text,
                    "score": result.get("score", 0.0),
                    "metadata": result.get("metadata", {}),
                }
            )

        # If no chunks found, return empty response
        if not context_chunks:
            return QueryResponse(
                answer="No relevant information found in the knowledge base.",
                summary="No matching content found.",
                timeline=[],
                citations=[],
                actions=[],
                query_id=str(uuid.uuid4()),
                processed_at=datetime.utcnow(),
            )

        # Synthesize response using Gemini
        gemini_client = get_gemini_client()
        response_data = await gemini_client.synthesize_rag_response(
            query=request.query,
            context_chunks=context_chunks,
            include_citations=request.include_citations,
        )

        # Build response
        citations = []
        if request.include_citations and "citations" in response_data:
            for citation_data in response_data["citations"]:
                citations.append(
                    Citation(
                        doc_id=citation_data.get("doc_id", "unknown"),
                        chunk_id=citation_data.get("chunk_id", "unknown"),
                        text=citation_data.get("text", "")[:500],  # Limit text length
                        score=citation_data.get("score", 0.0),
                        metadata={},
                    )
                )

        timeline = []
        if "timeline" in response_data:
            for item_data in response_data["timeline"]:
                date_str = item_data.get("date")
                date_obj = None
                if date_str:
                    try:
                        date_obj = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
                    except Exception:
                        pass

                timeline.append(
                    TimelineItem(
                        date=date_obj,
                        title=item_data.get("title", ""),
                        description=item_data.get("description", ""),
                        source=item_data.get("source"),
                    )
                )

        actions = []
        if "actions" in response_data:
            for action_data in response_data["actions"]:
                actions.append(
                    ActionItem(
                        action=action_data.get("action", "unknown"),
                        title=action_data.get("title", ""),
                        description=action_data.get("description", ""),
                        priority=action_data.get("priority", "medium"),
                        metadata={},
                    )
                )

        return QueryResponse(
            answer=response_data.get("answer", "Unable to generate answer."),
            summary=response_data.get("summary", ""),
            timeline=timeline,
            citations=citations,
            actions=actions,
            query_id=str(uuid.uuid4()),
            processed_at=datetime.utcnow(),
        )

    except Exception as e:
        logger.error(f"Error processing query: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process query: {str(e)}",
        )

