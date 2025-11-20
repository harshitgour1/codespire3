"""Background worker for document ingestion."""

import logging
import os
import uuid
from typing import Any, Dict, Optional

from celery import Celery

from app.config import Settings, get_settings
from services.embeddings import get_embedding_service
from services.preprocess import get_preprocess_service
from services.vector_store import get_vector_store

logger = logging.getLogger(__name__)

# Initialize Celery
settings = get_settings()

celery_app = Celery(
    "ekos_workers",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)


@celery_app.task(name="workers.worker_ingest.process_document_task")
def process_document_task(doc_id: str, file_path: str, metadata: Optional[Dict[str, Any]] = None):
    """
    Process document: preprocess, chunk, generate embeddings, and upsert to vector store.

    This is a Celery task that runs in the background worker.

    Args:
        doc_id: Document ID
        file_path: Path to document file (or URL for remote files)
        metadata: Optional document metadata

    Returns:
        Processing result
    """
    try:
        metadata = metadata or {}
        logger.info(f"Processing document: {doc_id} from {file_path}")

        # Step 1: Preprocess document (OCR/STT, chunking)
        preprocess_service = get_preprocess_service()

        # Download file if it's a URL
        if file_path.startswith("http://") or file_path.startswith("https://"):
            import httpx
            import tempfile

            with tempfile.NamedTemporaryFile(delete=False, suffix=".tmp") as tmp_file:
                with httpx.Client() as client:
                    response = client.get(file_path, timeout=60.0)
                    response.raise_for_status()
                    tmp_file.write(response.content)
                    actual_file_path = tmp_file.name
        else:
            actual_file_path = file_path

        # Process document (async method needs to be awaited in async context)
        import asyncio
        result = asyncio.run(
            preprocess_service.process_document(
                doc_id=doc_id,
                file_path=actual_file_path,
                options={
                    "ocr": True,  # Enable OCR for images
                    "stt": True,  # Enable STT for audio
                    "chunk_size": 1000,
                    "chunk_overlap": 200,
                },
            )
        )

        chunks = result.get("chunks", [])
        logger.info(f"Generated {len(chunks)} chunks for doc_id: {doc_id}")

        if not chunks:
            logger.warning(f"No chunks generated for doc_id: {doc_id}")
            return {
                "doc_id": doc_id,
                "status": "no_chunks",
                "message": "No chunks generated",
            }

        # Step 2: Generate embeddings
        embedding_service = get_embedding_service()

        chunk_texts = [chunk["text"] for chunk in chunks]
        import asyncio
        embeddings = asyncio.run(embedding_service.generate_embeddings_batch(chunk_texts))

        # Step 3: Upsert to vector store
        vector_store = get_vector_store()

        tenant_id = metadata.get("tenant_id", "default")
        vectors = []

        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            chunk_id = f"{doc_id}_chunk_{i}"

            vector = {
                "id": chunk_id,
                "values": embedding,
                "metadata": {
                    "doc_id": doc_id,
                    "chunk_id": chunk_id,
                    "text": chunk["text"][:1000],  # Limit text in metadata
                    "tenant_id": tenant_id,
                    "source": metadata.get("source", "unknown"),
                    **chunk.get("metadata", {}),
                    **metadata,
                },
            }
            vectors.append(vector)

        # Batch upsert
        import asyncio
        upsert_result = asyncio.run(vector_store.upsert(vectors=vectors, namespace=tenant_id))

        logger.info(f"Upserted {len(vectors)} vectors for doc_id: {doc_id}")

        # Cleanup temporary file if downloaded
        if file_path.startswith("http://") or file_path.startswith("https://"):
            try:
                os.unlink(actual_file_path)
            except Exception:
                pass

        return {
            "doc_id": doc_id,
            "status": "success",
            "chunks_processed": len(chunks),
            "vectors_upserted": upsert_result.get("upserted_count", 0),
            "message": f"Processed {len(chunks)} chunks and upserted to vector store",
        }

    except Exception as e:
        logger.error(f"Error processing document {doc_id}: {e}", exc_info=True)
        return {
            "doc_id": doc_id,
            "status": "error",
            "message": str(e),
        }


# Alternative: Async task (if using async workers)
@celery_app.task(name="workers.worker_ingest.process_document_task_async")
async def process_document_task_async(
    doc_id: str, file_path: str, metadata: Optional[Dict[str, Any]] = None
):
    """Async version of process_document_task (if using async Celery workers)."""
    # Same logic as above but with async/await
    # Note: Celery async support requires additional configuration
    pass


if __name__ == "__main__":
    # Run worker directly
    celery_app.worker_main()

