"""Webhook router for n8n and external integrations."""

import hashlib
import hmac
import json
import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status

from app.config import Settings, get_settings

logger = logging.getLogger(__name__)

router = APIRouter()


def verify_webhook_signature(
    payload: bytes,
    signature: str,
    secret: str,
) -> bool:
    """Verify webhook signature (HMAC)."""
    expected_signature = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)


@router.post("/n8n/connector-callback")
async def n8n_connector_callback(
    request: Request,
    x_n8n_signature: str | None = Header(None, alias="X-N8N-Signature"),
    settings: Settings = Depends(get_settings),
):
    """
    n8n webhook endpoint.

    Receives callbacks from n8n workflows and processes them.
    """
    try:
        # Get request body
        body = await request.body()

        # Verify signature if secret is configured
        if settings.n8n_webhook_secret and x_n8n_signature:
            if not verify_webhook_signature(body, x_n8n_signature, settings.n8n_webhook_secret):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid webhook signature",
                )

        # Parse payload
        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            payload = {"raw": body.decode("utf-8")}

        logger.info(f"Received n8n webhook: {payload}")

        # Process webhook based on payload
        # TODO: Route to appropriate handlers based on payload type
        event_type = payload.get("event_type", "unknown")
        data = payload.get("data", {})

        # Example: Handle Google Drive sync
        if event_type == "drive_sync":
            # Queue document for ingestion
            try:
                from workers.worker_ingest import process_document_task

                doc_id = data.get("doc_id")
                file_url = data.get("file_url")
                metadata = data.get("metadata", {})

                # Download and process
                task = process_document_task.delay(doc_id, file_url, metadata)
                return {
                    "status": "queued",
                    "task_id": task.id,
                    "message": f"Document queued for ingestion: {doc_id}",
                }
            except Exception as e:
                logger.error(f"Error processing n8n webhook: {e}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to process webhook: {str(e)}",
                )

        # Default response
        return {
            "status": "received",
            "event_type": event_type,
            "message": "Webhook received and logged",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error handling n8n webhook: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process webhook: {str(e)}",
        )

