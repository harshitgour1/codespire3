"""Ingestion router for document ingestion."""

import hashlib
import logging
import os
import uuid
from datetime import datetime
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.config import Settings, get_settings
from app.dependencies import get_tenant_id
from app.models.ingest import IngestUrlRequest, IngestUrlResponse, IngestUploadResponse
from app.models.common import Metadata

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/url", response_model=IngestUrlResponse)
async def ingest_url(
    request: IngestUrlRequest,
    tenant_id: Annotated[str, Depends(get_tenant_id)] = "default",
):
    """
    Ingest document from URL.

    Accepts a URL and metadata, downloads the content, and queues it for processing.
    """
    try:
        import httpx

        # Download content from URL
        async with httpx.AsyncClient() as client:
            response = await client.get(request.url, timeout=30.0)
            response.raise_for_status()
            content = response.text

        # Generate document ID
        doc_id = hashlib.sha256(f"{request.url}{tenant_id}".encode()).hexdigest()[:16]

        # Save to file (for preprocessing)
        settings = get_settings()
        os.makedirs(settings.upload_dir, exist_ok=True)
        file_path = os.path.join(settings.upload_dir, f"{doc_id}.txt")

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

        # Queue for background processing
        try:
            from workers.worker_ingest import process_document_task

            # Enqueue task
            task = process_document_task.delay(doc_id, file_path, request.metadata)
            logger.info(f"Queued ingestion task: {task.id} for doc_id: {doc_id}")
        except Exception as e:
            logger.warning(f"Failed to queue task (worker not available): {e}")
            # Continue without background processing

        metadata = Metadata(
            source=request.source,
            tenant_id=request.tenant_id or tenant_id,
            created_at=datetime.utcnow(),
            tags=request.metadata.get("tags", []),
            custom=request.metadata,
        )

        return IngestUrlResponse(
            doc_id=doc_id,
            status="queued",
            message=f"Document queued for ingestion: {doc_id}",
            metadata=metadata,
        )

    except Exception as e:
        logger.error(f"Error ingesting URL: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to ingest URL: {str(e)}",
        )


@router.post("/upload", response_model=IngestUploadResponse)
async def ingest_upload(
    file: Annotated[UploadFile, File(...)],
    source: Annotated[Optional[str], Form()] = None,
    tenant_id: Annotated[str, Depends(get_tenant_id)] = "default",
    metadata: Annotated[Optional[str], Form()] = None,
):
    """
    Upload file for ingestion.

    Accepts multipart/form-data file uploads and queues them for processing.
    """
    try:
        import json

        settings = get_settings()

        # Check file size
        file_content = await file.read()
        file_size = len(file_content)

        max_size = settings.max_upload_size_mb * 1024 * 1024
        if file_size > max_size:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Maximum size: {settings.max_upload_size_mb}MB",
            )

        # Generate document ID
        doc_id = str(uuid.uuid4())

        # Save file
        os.makedirs(settings.upload_dir, exist_ok=True)
        file_ext = os.path.splitext(file.filename)[1] if file.filename else ""
        file_path = os.path.join(settings.upload_dir, f"{doc_id}{file_ext}")

        with open(file_path, "wb") as f:
            f.write(file_content)

        # Parse metadata
        metadata_dict = {}
        if metadata:
            try:
                metadata_dict = json.loads(metadata)
            except json.JSONDecodeError:
                pass

        # Queue for background processing
        try:
            from workers.worker_ingest import process_document_task

            task = process_document_task.delay(doc_id, file_path, metadata_dict)
            logger.info(f"Queued ingestion task: {task.id} for doc_id: {doc_id}")
        except Exception as e:
            logger.warning(f"Failed to queue task (worker not available): {e}")

        return IngestUploadResponse(
            doc_id=doc_id,
            filename=file.filename or "unknown",
            status="queued",
            message=f"File queued for ingestion: {doc_id}",
            file_size=file_size,
            content_type=file.content_type,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}",
        )

