"""Pydantic models for query endpoints."""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    """Request model for RAG query."""

    query: str = Field(..., description="Natural language query")
    tenant_id: str = Field(default="default", description="Tenant ID")
    filters: Dict[str, Any] = Field(
        default_factory=dict, description="Additional filters (source, tags, etc.)"
    )
    top_k: int = Field(default=5, ge=1, le=20, description="Number of results to retrieve")
    include_citations: bool = Field(default=True, description="Include source citations")


class Citation(BaseModel):
    """Citation reference."""

    doc_id: str = Field(..., description="Document ID")
    chunk_id: str = Field(..., description="Chunk ID")
    text: str = Field(..., description="Relevant text snippet")
    score: float = Field(..., description="Relevance score")
    metadata: Dict[str, Any] = Field(default_factory=dict)


class TimelineItem(BaseModel):
    """Timeline item for chronological information."""

    date: Optional[datetime] = None
    title: str = Field(..., description="Timeline item title")
    description: str = Field(..., description="Timeline item description")
    source: Optional[str] = None


class ActionItem(BaseModel):
    """Action item extracted from query or content."""

    action: str = Field(..., description="Action type (e.g., 'create_jira', 'send_email')")
    title: str = Field(..., description="Action title")
    description: str = Field(..., description="Action description")
    priority: str = Field(default="medium", description="Priority level")
    metadata: Dict[str, Any] = Field(default_factory=dict)


class QueryResponse(BaseModel):
    """Response model for RAG query."""

    answer: str = Field(..., description="Generated answer")
    summary: str = Field(..., description="Brief summary")
    timeline: List[TimelineItem] = Field(default_factory=list, description="Timeline items")
    citations: List[Citation] = Field(default_factory=list, description="Source citations")
    actions: List[ActionItem] = Field(default_factory=list, description="Suggested actions")
    query_id: str = Field(..., description="Query ID for tracking")
    processed_at: datetime = Field(default_factory=datetime.utcnow)


class ScreenshotMatchRequest(BaseModel):
    """Request model for screenshot matching."""

    image_base64: Optional[str] = Field(None, description="Base64 encoded image")
    image_url: Optional[str] = Field(None, description="Image URL")
    tenant_id: str = Field(default="default", description="Tenant ID")
    top_k: int = Field(default=5, ge=1, le=20, description="Number of matches to return")


class ScreenshotMatch(BaseModel):
    """Screenshot match result."""

    doc_id: str = Field(..., description="Matched document ID")
    chunk_id: Optional[str] = Field(None, description="Matched chunk ID")
    score: float = Field(..., description="Match confidence score")
    text: Optional[str] = Field(None, description="Relevant text")
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ScreenshotMatchResponse(BaseModel):
    """Response model for screenshot matching."""

    matches: List[ScreenshotMatch] = Field(..., description="List of matches")
    query_id: str = Field(..., description="Query ID for tracking")
    processed_at: datetime = Field(default_factory=datetime.utcnow)

