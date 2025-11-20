"""Embedding generation service using Gemini or fallback methods."""

import hashlib
import logging
from typing import List, Optional

import numpy as np

from services.gemini_client import get_gemini_client

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Service for generating embeddings."""

    def __init__(self):
        """Initialize embedding service."""
        self.gemini_client = get_gemini_client()

    async def generate_embedding(self, text: str, model: str = "embedding-001") -> List[float]:
        """
        Generate embedding for a text string.

        Args:
            text: Input text
            model: Embedding model name

        Returns:
            Embedding vector
        """
        # TODO: Implement Gemini embedding API when available
        # For now, use a simple hash-based embedding (not for production!)

        # Mock embedding: hash-based deterministic vector
        # This is a placeholder - replace with real Gemini embedding API
        hash_obj = hashlib.md5(text.encode())
        hash_bytes = hash_obj.digest()

        # Convert hash to 384-dimensional vector (typical embedding size)
        # This is a simplified mock - NOT a real embedding
        embedding = []
        for i in range(0, min(len(hash_bytes) * 2, 384), 2):
            if i + 1 < len(hash_bytes) * 2:
                val = (hash_bytes[i % len(hash_bytes)] << 8) + hash_bytes[(i + 1) % len(hash_bytes)]
                embedding.append((val / 65535.0) - 0.5)  # Normalize to [-0.5, 0.5]

        # Pad to 384 dimensions
        while len(embedding) < 384:
            embedding.append(0.0)

        embedding = embedding[:384]

        # Normalize
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = (np.array(embedding) / norm).tolist()

        logger.debug(f"Generated mock embedding for text: {text[:50]}...")

        # TODO: Replace with real Gemini embedding API:
        # try:
        #     result = await self.gemini_client.models.embed_content(
        #         model=model,
        #         content=text,
        #         task_type="retrieval_document"  # or "retrieval_query"
        #     )
        #     return result.embedding.values
        # except Exception as e:
        #     logger.error(f"Error generating embedding: {e}")
        #     raise

        return embedding

    async def generate_embeddings_batch(
        self, texts: List[str], model: str = "embedding-001"
    ) -> List[List[float]]:
        """
        Generate embeddings for multiple texts.

        Args:
            texts: List of input texts
            model: Embedding model name

        Returns:
            List of embedding vectors
        """
        # Process in parallel (async)
        import asyncio

        embeddings = await asyncio.gather(*[self.generate_embedding(text, model) for text in texts])
        return embeddings

    def cosine_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """
        Calculate cosine similarity between two embeddings.

        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector

        Returns:
            Cosine similarity score (0-1)
        """
        vec1 = np.array(embedding1)
        vec2 = np.array(embedding2)

        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)

        if norm1 == 0 or norm2 == 0:
            return 0.0

        return float(dot_product / (norm1 * norm2))


# Singleton instance
_embedding_service: Optional[EmbeddingService] = None


def get_embedding_service() -> EmbeddingService:
    """Get singleton embedding service instance."""
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService()
    return _embedding_service

