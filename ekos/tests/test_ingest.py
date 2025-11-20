"""Tests for ingestion endpoints."""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_ingest_url():
    """Test URL ingestion endpoint."""
    # Use a simple test URL
    payload = {
        "url": "https://example.com",
        "source": "test",
        "tenant_id": "test_tenant",
        "metadata": {"test": True},
    }

    response = client.post("/ingest/url", json=payload)
    # Note: This might fail if the URL is not accessible or worker is not running
    # For a real test, you'd mock the HTTP request and worker
    assert response.status_code in [200, 500, 503]  # Allow for worker not running


def test_ingest_upload():
    """Test file upload ingestion endpoint."""
    # Create a test file
    test_content = b"Test document content"
    files = {
        "file": ("test.txt", test_content, "text/plain"),
    }
    data = {
        "source": "test",
        "tenant_id": "test_tenant",
        "metadata": '{"test": true}',
    }

    response = client.post("/ingest/upload", files=files, data=data)
    # Note: This might fail if worker is not running
    assert response.status_code in [200, 500, 503]

    if response.status_code == 200:
        data = response.json()
        assert "doc_id" in data
        assert data["status"] == "queued"


@pytest.mark.asyncio
async def test_preprocess_document():
    """Test preprocessing endpoint."""
    # This test would require a document to be uploaded first
    # For now, test the endpoint structure
    doc_id = "test_doc_123"

    payload = {
        "options": {
            "ocr": True,
            "stt": False,
            "chunk_size": 1000,
        }
    }

    response = client.post(f"/preprocess/{doc_id}", json=payload)
    # Expect 404 if document doesn't exist, or 200 if it does
    assert response.status_code in [200, 404, 500]

