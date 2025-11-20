"""Pydantic models for ingestion endpoints."""

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field

from app.models.common import Metadata


class IngestUrlRequest(BaseModel):
    """Request model for URL ingestion."""

    url: str = Field(..., description="URL to ingest")
    source: str = Field(default="url", description="Source identifier")
    tenant_id: str = Field(default="default", description="Tenant ID")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


class IngestUrlResponse(BaseModel):
    """Response model for URL ingestion."""

    doc_id: str = Field(..., description="Document ID")
    status: str = Field(..., description="Ingestion status")
    message: str = Field(..., description="Status message")
    metadata: Metadata = Field(..., description="Document metadata")


class IngestUploadResponse(BaseModel):
    """Response model for file upload ingestion."""

    doc_id: str = Field(..., description="Document ID")
    filename: str = Field(..., description="Uploaded filename")
    status: str = Field(..., description="Ingestion status")
    message: str = Field(..., description="Status message")
    file_size: int = Field(..., description="File size in bytes")
    content_type: Optional[str] = Field(None, description="MIME type")


class PreprocessRequest(BaseModel):
    """Request model for preprocessing."""

    doc_id: str = Field(..., description="Document ID to preprocess")
    options: Dict[str, Any] = Field(
        default_factory=dict, description="Preprocessing options (ocr, stt, chunking)"
    )


class PreprocessResponse(BaseModel):
    """Response model for preprocessing."""

    doc_id: str = Field(..., description="Document ID")
    status: str = Field(..., description="Preprocessing status")
    message: str = Field(..., description="Status message")
    chunks_created: int = Field(default=0, description="Number of chunks created")
    processed_at: datetime = Field(default_factory=datetime.utcnow)

