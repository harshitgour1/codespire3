"""Automation router for external integrations (Jira, etc.)."""

import logging
from typing import Any, Dict

from fastapi import APIRouter, HTTPException, status

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/create-jira")
async def create_jira_ticket(data: Dict[str, Any]):
    """
    Create Jira ticket (stub).

    TODO: Implement Jira integration.

    Required configuration:
    - JIRA_URL
    - JIRA_USERNAME
    - JIRA_API_TOKEN
    """
    # TODO: Implement Jira integration
    # from jira import JIRA
    # jira = JIRA(
    #     server=settings.jira_url,
    #     basic_auth=(settings.jira_username, settings.jira_api_token)
    # )
    # issue = jira.create_issue(
    #     project=data.get("project"),
    #     summary=data.get("summary"),
    #     description=data.get("description"),
    #     issuetype={"name": data.get("issue_type", "Task")}
    # )
    # return {"issue_id": issue.key, "status": "created"}

    logger.warning("Jira integration not yet implemented. Using mock response.")
    return {
        "issue_id": "MOCK-123",
        "status": "mock_created",
        "message": "Jira integration not configured. This is a stub response.",
        "data": data,
    }

