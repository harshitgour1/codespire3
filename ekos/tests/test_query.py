"""Tests for query endpoints."""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_query_endpoint():
    """Test RAG query endpoint."""
    payload = {
        "query": "What is EKOS?",
        "tenant_id": "test_tenant",
        "filters": {},
        "top_k": 5,
        "include_citations": True,
    }

    response = client.post("/query", json=payload)
    # Should work even with mock vector store
    assert response.status_code == 200

    data = response.json()
    assert "answer" in data
    assert "summary" in data
    assert "citations" in data
    assert "timeline" in data
    assert "actions" in data
    assert "query_id" in data


def test_screenshot_match():
    """Test screenshot matching endpoint."""
    # Create a simple test image (1x1 pixel PNG in base64)
    test_image_base64 = (
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    )

    payload = {
        "image_base64": test_image_base64,
        "tenant_id": "test_tenant",
        "top_k": 5,
    }

    response = client.post("/screenshot-match", json=payload)
    assert response.status_code in [200, 400]  # 400 if image format is invalid

    if response.status_code == 200:
        data = response.json()
        assert "matches" in data
        assert "query_id" in data

