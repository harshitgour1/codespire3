"""FastAPI main application entry point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import Settings, get_settings
from app.routers import (
    automation,
    health,
    ingest,
    preprocess,
    query,
    screenshot,
    webhook,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown tasks."""
    # Startup
    logger.info("Starting EKOS backend...")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug: {settings.debug}")

    # Create upload directory if it doesn't exist
    import os

    os.makedirs(settings.upload_dir, exist_ok=True)

    yield

    # Shutdown
    logger.info("Shutting down EKOS backend...")


# Create FastAPI app
app = FastAPI(
    title="EKOS - Enterprise Knowledge OS",
    description="Production-ready FastAPI backend for enterprise knowledge management",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(ingest.router, prefix="/ingest", tags=["ingest"])
app.include_router(preprocess.router, prefix="/preprocess", tags=["preprocess"])
app.include_router(query.router, prefix="/query", tags=["query"])
app.include_router(screenshot.router, prefix="/screenshot-match", tags=["screenshot"])
app.include_router(automation.router, prefix="/automation", tags=["automation"])
app.include_router(webhook.router, prefix="/webhook", tags=["webhook"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "EKOS - Enterprise Knowledge OS",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
    )

