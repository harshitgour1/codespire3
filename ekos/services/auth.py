"""Authentication service (JWT/OAuth stub)."""

import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from jose import jwt
from passlib.context import CryptContext

from app.config import Settings, get_settings

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Authentication service with JWT and OAuth support."""

    def __init__(self, settings: Settings | None = None):
        """Initialize auth service."""
        self.settings = settings or get_settings()
        self.secret_key = self.settings.jwt_secret_key
        self.algorithm = self.settings.jwt_algorithm
        self.access_token_expire_minutes = self.settings.jwt_access_token_expire_minutes

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash."""
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """Hash password."""
        return pwd_context.hash(password)

    def create_access_token(
        self,
        data: Dict[str, Any],
        expires_delta: Optional[timedelta] = None,
    ) -> str:
        """
        Create JWT access token.

        Args:
            data: Token payload
            expires_delta: Optional expiration delta

        Returns:
            Encoded JWT token
        """
        to_encode = data.copy()

        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)

        to_encode.update({"exp": expire, "iat": datetime.utcnow()})

        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def decode_token(self, token: str) -> Dict[str, Any]:
        """
        Decode JWT token.

        Args:
            token: JWT token

        Returns:
            Decoded token payload
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.JWTError as e:
            logger.error(f"Error decoding token: {e}")
            raise

    async def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Authenticate user (stub).

        TODO: Implement real user authentication with database.

        Args:
            username: Username
            password: Password

        Returns:
            User data if authenticated, None otherwise
        """
        # TODO: Implement real authentication
        # from app.db import get_user_by_username
        # user = await get_user_by_username(username)
        # if not user:
        #     return None
        # if not self.verify_password(password, user.hashed_password):
        #     return None
        # return user

        # Mock authentication for development
        logger.warning("Using mock authentication. Implement real authentication.")
        if username == "admin" and password == "admin":
            return {"id": "1", "username": "admin", "email": "admin@example.com", "role": "admin"}
        return None

    async def oauth_authenticate(self, provider: str, token: str) -> Optional[Dict[str, Any]]:
        """
        Authenticate via OAuth provider (stub).

        TODO: Implement OAuth flows (Google, GitHub, etc.).

        Args:
            provider: OAuth provider name
            token: OAuth token

        Returns:
            User data if authenticated, None otherwise
        """
        # TODO: Implement OAuth
        # if provider == "google":
        #     # Verify Google token
        #     # Extract user info
        #     # Create/update user in database
        #     pass

        logger.warning(f"OAuth authentication for {provider} not yet implemented")
        return None


# Singleton instance
_auth_service: Optional[AuthService] = None


def get_auth_service() -> AuthService:
    """Get singleton auth service instance."""
    global _auth_service
    if _auth_service is None:
        _auth_service = AuthService()
    return _auth_service

