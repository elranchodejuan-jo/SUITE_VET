"""Reusable authenticated-user dependency."""

from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security.jwt import (
    JwksUnavailableError,
    JwtVerificationError,
    get_jwks_client,
    verify_access_token,
)
from app.schemas.auth import CurrentUser

bearer_scheme = HTTPBearer(auto_error=False, scheme_name="SupabaseBearer")


def get_current_user(
    request: Request,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> CurrentUser:
    if (
        credentials is None
        or credentials.scheme.lower() != "bearer"
        or not credentials.credentials
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        return verify_access_token(
            credentials.credentials,
            request.app.state.settings,
            get_jwks_client(request),
        )
    except JwksUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service temporarily unavailable",
            headers={"Retry-After": "5"},
        ) from exc
    except (JwtVerificationError, HTTPException) as exc:
        if isinstance(exc, HTTPException):
            raise exc
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
