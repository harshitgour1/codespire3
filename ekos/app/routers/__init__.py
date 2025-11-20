"""FastAPI routers."""

from app.routers import (
    automation,
    health,
    ingest,
    preprocess,
    query,
    screenshot,
    webhook,
)

__all__ = [
    "automation",
    "health",
    "ingest",
    "preprocess",
    "query",
    "screenshot",
    "webhook",
]
