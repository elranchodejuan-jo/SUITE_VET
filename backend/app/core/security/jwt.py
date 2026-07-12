"""Offline-testable JWKS and JWT verification for Supabase Auth."""

from __future__ import annotations

import json
import threading
import time
from dataclasses import dataclass
from typing import Any
from urllib.error import URLError
from urllib.request import Request as UrlRequest, urlopen
from uuid import UUID

from fastapi import HTTPException, Request, status

from app.core.config import Settings
from app.schemas.auth import CurrentUser

ALLOWED_ALGORITHMS = ("RS256", "ES256", "EdDSA")
JWKS_TTL_SECONDS = 300


class JwtVerificationError(ValueError):
    """Raised for any token or key-set validation failure."""


class JwksUnavailableError(JwtVerificationError):
    """Raised when the configured identity provider cannot supply keys."""


@dataclass
class JwksCache:
    keys: dict[str, dict[str, Any]]
    loaded_at: float


class JwksClient:
    def __init__(self, url: str, ttl: int = JWKS_TTL_SECONDS) -> None:
        self.url = url
        self.ttl = ttl
        self._cache: JwksCache | None = None
        self._lock = threading.Lock()

    def _fetch(self) -> dict[str, dict[str, Any]]:
        try:
            request = UrlRequest(self.url, headers={"Accept": "application/json"})
            with urlopen(request, timeout=5) as response:
                raw_payload = response.read(1_048_577)
            if len(raw_payload) > 1_048_576:
                raise JwksUnavailableError("JWKS response is too large")
            payload = json.loads(raw_payload.decode("utf-8"))
        except (OSError, URLError, ValueError, TimeoutError) as exc:
            raise JwksUnavailableError("JWKS unavailable") from exc
        keys = payload.get("keys") if isinstance(payload, dict) else None
        if not isinstance(keys, list):
            raise JwksUnavailableError("Invalid JWKS")
        normalized = {
            str(key["kid"]): key
            for key in keys
            if isinstance(key, dict) and key.get("kid")
        }
        if not normalized:
            raise JwksUnavailableError("Invalid JWKS")
        return normalized

    def get_key(self, kid: str) -> dict[str, Any]:
        with self._lock:
            now = time.monotonic()
            if self._cache is None or now - self._cache.loaded_at > self.ttl:
                self._cache = JwksCache(self._fetch(), now)
            if kid not in self._cache.keys:
                self._cache = JwksCache(self._fetch(), now)
            try:
                return self._cache.keys[kid]
            except KeyError as exc:
                raise JwtVerificationError("Unknown signing key") from exc


def _unauthorized(message: str = "Invalid authentication credentials") -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=message,
        headers={"WWW-Authenticate": "Bearer"},
    )


def verify_access_token(
    token: str, settings: Settings, jwks: JwksClient
) -> CurrentUser:
    try:
        import jwt
    except ImportError as exc:
        raise JwtVerificationError("JWT verifier dependency is unavailable") from exc
    if not token or len(token) > 16_384 or token.count(".") != 2:
        raise JwtVerificationError("Malformed token")
    try:
        header = jwt.get_unverified_header(token)
        algorithm = header.get("alg")
        kid = header.get("kid")
        if (
            algorithm not in ALLOWED_ALGORITHMS
            or not isinstance(kid, str)
            or not kid
            or len(kid) > 256
        ):
            raise JwtVerificationError("Unsupported token header")
        issuer = settings.supabase_issuer
        audience = settings.supabase_audience
        if not issuer or not settings.supabase_jwks_url:
            raise JwtVerificationError("JWT verification is not configured")
        key = jwt.PyJWK.from_dict(jwks.get_key(str(kid)), algorithm=algorithm).key
        claims = jwt.decode(
            token,
            key=key,
            algorithms=[algorithm],
            issuer=issuer,
            audience=audience,
            options={"require": ["exp", "iat", "iss", "aud", "sub"]},
        )
        user_id = UUID(str(claims["sub"]))
        return CurrentUser(
            id=user_id,
            email=claims.get("email") if isinstance(claims.get("email"), str) else None,
            audience=claims["aud"] if isinstance(claims["aud"], str) else audience,
            token_role=claims.get("role")
            if isinstance(claims.get("role"), str)
            else None,
        )
    except (
        jwt.PyJWTError,
        KeyError,
        TypeError,
        ValueError,
        JwtVerificationError,
    ) as exc:
        if isinstance(exc, JwtVerificationError):
            raise
        raise JwtVerificationError("Token verification failed") from exc


def get_jwks_client(request: Request) -> JwksClient:
    settings = request.app.state.settings
    url = settings.supabase_jwks_url
    if not url:
        raise _unauthorized()
    client = getattr(request.app.state, "jwks_client", None)
    if client is None or client.url != url:
        client = JwksClient(url)
        request.app.state.jwks_client = client
    return client
