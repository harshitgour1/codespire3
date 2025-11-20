"""Preprocessing router for OCR/STT and chunking."""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, status

from app.models.ingest import PreprocessRequest, PreprocessResponse
from services.preprocess import get_preprocess_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/{doc_id}", response_model=PreprocessResponse)
async def preprocess_document(
    doc_id: Annotated[str, Path(..., description="Document ID to preprocess")],
    request: PreprocessRequest,
):
    """
    Trigger OCR/STT and chunking for a document.

    Processes the document and creates chunks for vector indexing.
    """
    try:
        preprocess_service = get_preprocess_service()

        # Find document file
        from app.config import get_settings

        settings = get_settings()
        import os
        import glob

        # Search for document file
        file_patterns = [
            os.path.join(settings.upload_dir, f"{doc_id}.*"),
            os.path.join(settings.upload_dir, doc_id),
        ]

        file_path = None
        for pattern in file_patterns:
            matches = glob.glob(pattern)
            if matches:
                file_path = matches[0]
                break

        if not file_path or not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Document not found: {doc_id}",
            )

        # Process document
        result = await preprocess_service.process_document(
            doc_id=doc_id,
            file_path=file_path,
            options=request.options,
        )

        return PreprocessResponse(
            doc_id=doc_id,
            status=result["status"],
            message=f"Processed {result['chunk_count']} chunks",
            chunks_created=result["chunk_count"],
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error preprocessing document: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to preprocess document: {str(e)}",
        )

