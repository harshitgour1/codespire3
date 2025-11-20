"""Application configuration management."""

from functools import lru_cache
from typing import List, Optional, Union

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Server
    environment: str = "development"
    debug: bool = True
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    secret_key: str = "change-me-in-production-min-32-chars"

    # Gemini API
    gemini_api_key: Optional[str] = None
    secret_manager_project_id: Optional[str] = None
    secret_manager_secret_name: Optional[str] = None

    # Vector Database - Pinecone
    pinecone_api_key: Optional[str] = None
    pinecone_environment: str = "us-west1-gcp"
    pinecone_index_name: str = "ekos-embeddings"

    # Knowledge Graph - Neo4j
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: Optional[str] = None

    # Background Workers - Redis
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/0"
    celery_result_backend: str = "redis://localhost:6379/0"

    # n8n Webhook
    n8n_webhook_secret: Optional[str] = None

    # JWT
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30

    # CORS
    cors_origins: Union[List[str], str] = ["http://localhost:3000", "http://localhost:5173"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from comma-separated string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # File Upload
    max_upload_size_mb: int = 100
    upload_dir: str = "./uploads"

    # Logging
    log_level: str = "INFO"

    def get_gemini_api_key(self) -> Optional[str]:
        """Get Gemini API key from environment or Google Secret Manager."""
        if self.gemini_api_key:
            return self.gemini_api_key

        # TODO: Implement Google Secret Manager lookup
        # if self.secret_manager_project_id and self.secret_manager_secret_name:
        #     from google.cloud import secretmanager
        #     client = secretmanager.SecretManagerServiceClient()
        #     name = f"projects/{self.secret_manager_project_id}/secrets/{self.secret_manager_secret_name}/versions/latest"
        #     response = client.access_secret_version(request={"name": name})
        #     return response.payload.data.decode("UTF-8")

        return None


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

