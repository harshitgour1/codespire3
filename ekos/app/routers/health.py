"""Health check router."""

import logging
from datetime import datetime

from fastapi import APIRouter, Depends

from app.config import Settings, get_settings
from app.models.common import HealthResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("", response_model=HealthResponse)
async def health_check(settings: Settings = Depends(get_settings)):
    """Health check endpoint."""
    services = {
        "api": "healthy",
        "vector_store": "unknown",
        "knowledge_graph": "unknown",
        "gemini": "unknown",
    }

    # Check Gemini
    try:
        gemini_key = settings.get_gemini_api_key()
        services["gemini"] = "configured" if gemini_key else "not_configured"
    except Exception:
        services["gemini"] = "error"

    # Check vector store
    try:
        from services.vector_store import get_vector_store

        vector_store = get_vector_store()
        services["vector_store"] = "configured" if vector_store.api_key else "mock"
    except Exception:
        services["vector_store"] = "error"

    # Check knowledge graph
    try:
        from services.kg_service import get_kg_service

        kg_service = get_kg_service()
        services["knowledge_graph"] = "configured" if kg_service.password else "mock"
    except Exception:
        services["knowledge_graph"] = "error"

    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version="0.1.0",
        services=services,
    )

