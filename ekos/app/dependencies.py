"""Shared dependencies for FastAPI routes."""

from typing import Annotated, Optional

from fastapi import Depends, HTTPException, Header, status
from jose import JWTError, jwt

from app.config import Settings, get_settings


async def get_tenant_id(
    x_tenant_id: Annotated[Optional[str], Header(alias="X-Tenant-ID")] = None,
) -> str:
    """Extract tenant ID from request headers."""
    if not x_tenant_id:
        # For demo purposes, use default tenant
        return "default"
    return x_tenant_id


async def verify_token(
    authorization: Annotated[Optional[str], Header()] = None,
    settings: Settings = Depends(get_settings),
) -> Optional[dict]:
    """Verify JWT token from Authorization header."""
    if not authorization:
        # For demo purposes, allow requests without auth
        # TODO: Implement proper authentication
        return None

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme",
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
        )

    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )


# Optional: Require authentication
async def require_auth(
    token_payload: Optional[dict] = Depends(verify_token),
) -> dict:
    """Require authentication for protected routes."""
    if not token_payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return token_payload

