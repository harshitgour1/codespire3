"""Common Pydantic models."""

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class Metadata(BaseModel):
    """Metadata for documents and chunks."""

    source: Optional[str] = None
    tenant_id: str = "default"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    tags: list[str] = Field(default_factory=list)
    custom: Dict[str, Any] = Field(default_factory=dict)


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = "healthy"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    version: str = "0.1.0"
    services: Dict[str, str] = Field(default_factory=dict)

