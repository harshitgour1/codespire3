"""Vector store adapter for Pinecone/Weaviate."""

import logging
from typing import Any, Dict, List, Optional

from app.config import Settings, get_settings

logger = logging.getLogger(__name__)


class VectorStore:
    """Vector store adapter (Pinecone/Weaviate stub)."""

    def __init__(self, settings: Settings | None = None):
        """Initialize vector store."""
        self.settings = settings or get_settings()
        self.api_key = self.settings.pinecone_api_key
        self.index_name = self.settings.pinecone_index_name
        self.environment = self.settings.pinecone_environment

        # Mock storage for development
        self._mock_store: Dict[str, Dict[str, Any]] = {}

        if not self.api_key:
            logger.warning("PINECONE_API_KEY not found. Using mock vector store.")
            self._client = None
        else:
            # TODO: Initialize Pinecone client
            # import pinecone
            # pinecone.init(api_key=self.api_key, environment=self.environment)
            # self._client = pinecone.Index(self.index_name)
            logger.info("Pinecone client would be initialized here (stub)")
            self._client = None

    async def upsert(
        self,
        vectors: List[Dict[str, Any]],
        namespace: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Upsert vectors into the store.

        Args:
            vectors: List of vectors with id, values, and metadata
            namespace: Optional namespace for multi-tenancy

        Returns:
            Upsert result
        """
        if not self._client:
            # Mock upsert
            for vector in vectors:
                vector_id = vector.get("id")
                if vector_id:
                    self._mock_store[vector_id] = {
                        "values": vector.get("values", []),
                        "metadata": vector.get("metadata", {}),
                    }
            logger.info(f"Mock upserted {len(vectors)} vectors")
            return {"upserted_count": len(vectors), "status": "success"}

        # TODO: Implement real Pinecone upsert
        # try:
        #     result = self._client.upsert(vectors=vectors, namespace=namespace)
        #     return result
        # except Exception as e:
        #     logger.error(f"Error upserting vectors: {e}")
        #     raise

        return {"upserted_count": 0, "status": "not_implemented"}

    async def query(
        self,
        vector: List[float],
        top_k: int = 5,
        namespace: Optional[str] = None,
        filter: Optional[Dict[str, Any]] = None,
        include_metadata: bool = True,
    ) -> List[Dict[str, Any]]:
        """
        Query similar vectors.

        Args:
            vector: Query vector
            top_k: Number of results to return
            namespace: Optional namespace
            filter: Optional metadata filter
            include_metadata: Whether to include metadata in results

        Returns:
            List of similar vectors with scores
        """
        if not self._client:
            # Mock query - simple cosine similarity search
            from services.embeddings import get_embedding_service

            embedding_service = get_embedding_service()
            results = []

            for vector_id, stored_data in self._mock_store.items():
                stored_vector = stored_data.get("values", [])
                if not stored_vector:
                    continue

                # Check filter
                if filter:
                    metadata = stored_data.get("metadata", {})
                    if not self._matches_filter(metadata, filter):
                        continue

                # Calculate similarity
                similarity = embedding_service.cosine_similarity(vector, stored_vector)
                results.append(
                    {
                        "id": vector_id,
                        "score": similarity,
                        "metadata": stored_data.get("metadata", {}) if include_metadata else {},
                    }
                )

            # Sort by score descending
            results.sort(key=lambda x: x["score"], reverse=True)
            results = results[:top_k]

            logger.info(f"Mock query returned {len(results)} results")
            return results

        # TODO: Implement real Pinecone query
        # try:
        #     query_result = self._client.query(
        #         vector=vector,
        #         top_k=top_k,
        #         namespace=namespace,
        #         filter=filter,
        #         include_metadata=include_metadata,
        #     )
        #     return query_result.get("matches", [])
        # except Exception as e:
        #     logger.error(f"Error querying vectors: {e}")
        #     raise

        return []

    def _matches_filter(self, metadata: Dict[str, Any], filter: Dict[str, Any]) -> bool:
        """Check if metadata matches filter (simplified)."""
        for key, value in filter.items():
            if key not in metadata:
                return False
            if isinstance(value, dict):
                # Support operators like $eq, $in, etc.
                if "$in" in value:
                    if metadata[key] not in value["$in"]:
                        return False
                elif "$eq" in value:
                    if metadata[key] != value["$eq"]:
                        return False
            elif metadata[key] != value:
                return False
        return True

    async def delete(
        self,
        ids: List[str],
        namespace: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Delete vectors by IDs.

        Args:
            ids: List of vector IDs to delete
            namespace: Optional namespace

        Returns:
            Delete result
        """
        if not self._client:
            # Mock delete
            deleted = 0
            for vector_id in ids:
                if vector_id in self._mock_store:
                    del self._mock_store[vector_id]
                    deleted += 1
            logger.info(f"Mock deleted {deleted} vectors")
            return {"deleted_count": deleted, "status": "success"}

        # TODO: Implement real Pinecone delete
        # try:
        #     result = self._client.delete(ids=ids, namespace=namespace)
        #     return result
        # except Exception as e:
        #     logger.error(f"Error deleting vectors: {e}")
        #     raise

        return {"deleted_count": 0, "status": "not_implemented"}


# Singleton instance
_vector_store: Optional[VectorStore] = None


def get_vector_store() -> VectorStore:
    """Get singleton vector store instance."""
    global _vector_store
    if _vector_store is None:
        _vector_store = VectorStore()
    return _vector_store

