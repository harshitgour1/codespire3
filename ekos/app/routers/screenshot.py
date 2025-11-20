"""Screenshot matching router."""

import base64
import logging
import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.dependencies import get_tenant_id
from app.models.query import ScreenshotMatchRequest, ScreenshotMatchResponse, ScreenshotMatch
from services.gemini_client import get_gemini_client
from services.vector_store import get_vector_store

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("", response_model=ScreenshotMatchResponse)
async def screenshot_match(
    request: ScreenshotMatchRequest | None = None,
    image: Annotated[UploadFile | None, File()] = None,
    tenant_id: Annotated[str, Depends(get_tenant_id)] = "default",
):
    """
    Match screenshot to knowledge base.

    Accepts image upload or base64 encoded image and returns matching content.
    """
    try:
        # Get image data - support both JSON body and multipart form
        image_b64 = None
        
        if image:
            # Multipart file upload
            image_data = await image.read()
            image_b64 = base64.b64encode(image_data).decode("utf-8")
        elif request:
            # JSON body request
            if request.image_base64:
                image_b64 = request.image_base64
            elif request.image_url:
                # Download from URL
                import httpx

                async with httpx.AsyncClient() as client:
                    response = await client.get(request.image_url, timeout=30.0)
                    response.raise_for_status()
                    image_data = response.content
                    image_b64 = base64.b64encode(image_data).decode("utf-8")
        
        if not image_b64:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image required: provide 'image' file, 'image_base64', or 'image_url'",
            )

        # Use request parameters if provided
        top_k = request.top_k if request else 5
        tenant_id_param = (request.tenant_id if request else None) or tenant_id

        # Generate embeddings for screenshot (if available)
        # For now, use Gemini vision API for matching
        gemini_client = get_gemini_client()

        # Query vector store for screenshot embeddings (stub)
        # TODO: Store screenshot embeddings and match against them
        vector_store = get_vector_store()

        # Mock existing screenshots (in production, query from vector store)
        existing_screenshots = [
            {
                "doc_id": "doc_1",
                "chunk_id": "chunk_1",
                "description": "Example screenshot description",
                "metadata": {"tenant_id": tenant_id_param},
            }
        ]

        # Match screenshot using Gemini
        matches_data = await gemini_client.screenshot_match_prompt(
            image_base64=image_b64,
            existing_screenshots=existing_screenshots,
        )

        # Build response
        matches = []
        for match_data in matches_data[:top_k]:
            matches.append(
                ScreenshotMatch(
                    doc_id=match_data.get("doc_id", "unknown"),
                    chunk_id=match_data.get("chunk_id"),
                    score=float(match_data.get("score", 0.0)),
                    text=match_data.get("description") or match_data.get("text"),
                    metadata=match_data.get("metadata", {}),
                )
            )

        return ScreenshotMatchResponse(
            matches=matches,
            query_id=str(uuid.uuid4()),
            processed_at=datetime.utcnow(),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error matching screenshot: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to match screenshot: {str(e)}",
        )

