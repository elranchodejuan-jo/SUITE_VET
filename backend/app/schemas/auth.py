"""Sanitized authentication response models."""

from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator


class CurrentUser(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: UUID
    email: str | None = None
    audience: str
    token_role: str | None = None

    @field_validator("email")
    @classmethod
    def validate_optional_email(cls, value: str | None) -> str | None:
        if value is None:
            return None
        candidate = value.strip()
        if (
            len(candidate) > 254
            or candidate.count("@") != 1
            or any(char.isspace() for char in candidate)
        ):
            raise ValueError("Invalid email claim")
        local, domain = candidate.rsplit("@", 1)
        if (
            not local
            or "." not in domain
            or domain.startswith(".")
            or domain.endswith(".")
        ):
            raise ValueError("Invalid email claim")
        return candidate

    @field_validator("token_role")
    @classmethod
    def validate_optional_token_role(cls, value: str | None) -> str | None:
        if value is None:
            return None
        candidate = value.strip()
        if not candidate or len(candidate) > 64:
            raise ValueError("Invalid role claim")
        return candidate


class AuthMeResponse(CurrentUser):
    pass
