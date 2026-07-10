"""Typed, environment-driven configuration for the Suite Vet API."""

from functools import lru_cache
from pathlib import Path
from typing import Literal
from urllib.parse import urlsplit

from fastapi import Request
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

EnvironmentName = Literal["development", "test", "production"]
BACKEND_DIRECTORY = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """Runtime settings loaded from SUITEVET_ environment variables."""

    app_name: str = "Suite Vet API"
    service_name: str = "suite-vet-api"
    app_version: str = "0.1.0"
    environment: EnvironmentName = "development"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    )
    host: str = "127.0.0.1"
    port: int = Field(default=8000, ge=1, le=65535)

    model_config = SettingsConfigDict(
        env_prefix="SUITEVET_",
        env_file=BACKEND_DIRECTORY / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("api_v1_prefix")
    @classmethod
    def validate_api_prefix(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized.startswith("/"):
            raise ValueError("api_v1_prefix must start with '/'")
        if normalized != "/" and normalized.endswith("/"):
            normalized = normalized.rstrip("/")
        return normalized

    @field_validator("cors_origins")
    @classmethod
    def validate_cors_origins(cls, origins: list[str]) -> list[str]:
        if not origins:
            raise ValueError("cors_origins must contain at least one explicit origin")

        normalized: list[str] = []
        for origin in origins:
            candidate = origin.strip().rstrip("/")
            if candidate == "*":
                raise ValueError("wildcard CORS origins are not allowed")
            parsed = urlsplit(candidate)
            if parsed.scheme not in {"http", "https"} or not parsed.netloc:
                raise ValueError("each CORS origin must be an absolute HTTP(S) origin")
            if parsed.path or parsed.query or parsed.fragment:
                raise ValueError("CORS origins cannot include paths, queries or fragments")
            if candidate not in normalized:
                normalized.append(candidate)
        return normalized


@lru_cache
def get_settings() -> Settings:
    """Return one cached settings object for the current process."""

    return Settings()


def get_request_settings(request: Request) -> Settings:
    """Resolve the settings attached by the application factory."""

    return request.app.state.settings
