"""Offline JWT verification tests; no Supabase network calls."""

from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import rsa
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.core.config import Settings
from app.core.security.jwt import JwksClient, JwksUnavailableError
from app.main import create_app

ISSUER = "https://suite-vet-dev.supabase.co/auth/v1"
JWKS_URL = f"{ISSUER}/.well-known/jwks.json"
AUDIENCE = "authenticated"


def base_claims() -> dict[str, object]:
    now = datetime.now(timezone.utc)
    return {
        "sub": str(uuid4()),
        "iss": ISSUER,
        "aud": AUDIENCE,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=5)).timestamp()),
        "email": "student@example.test",
        "role": "authenticated",
    }


def signed_token(
    private_key, *, kid: str = "test-key", claims: dict[str, object] | None = None
) -> str:
    return jwt.encode(
        claims or base_claims(), private_key, algorithm="RS256", headers={"kid": kid}
    )


@pytest.fixture
def auth_context(monkeypatch: pytest.MonkeyPatch):
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_jwk = jwt.algorithms.RSAAlgorithm.to_jwk(
        private_key.public_key(), as_dict=True
    )
    public_jwk["kid"] = "test-key"
    fetch_count = {"value": 0}

    def fetch(_self):
        fetch_count["value"] += 1
        return {"test-key": public_jwk}

    monkeypatch.setattr(JwksClient, "_fetch", fetch)
    settings = Settings(
        _env_file=None,
        environment="test",
        supabase_url="https://suite-vet-dev.supabase.co",
        supabase_jwks_url=JWKS_URL,
        supabase_issuer=ISSUER,
        supabase_audience=AUDIENCE,
    )
    with TestClient(create_app(settings)) as client:
        yield client, private_key, fetch_count


def authorization(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_missing_authorization_returns_uniform_401(auth_context):
    response = auth_context[0].get("/api/v1/auth/me")
    assert response.status_code == 401
    assert response.headers["www-authenticate"] == "Bearer"
    assert response.json() == {
        "error": {"status": 401, "message": "Invalid authentication credentials"}
    }


@pytest.mark.parametrize("header", ["Basic abc", "Bearer", "Bearer "])
def test_wrong_or_empty_authorization_scheme_returns_401(header, auth_context):
    assert (
        auth_context[0]
        .get("/api/v1/auth/me", headers={"Authorization": header})
        .status_code
        == 401
    )


def test_malformed_token_returns_401(auth_context):
    assert (
        auth_context[0]
        .get("/api/v1/auth/me", headers=authorization("malformed"))
        .status_code
        == 401
    )


def test_invalid_signature_returns_401(auth_context):
    other_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    assert (
        auth_context[0]
        .get("/api/v1/auth/me", headers=authorization(signed_token(other_key)))
        .status_code
        == 401
    )


@pytest.mark.parametrize(
    "mutate",
    [
        lambda claims: claims.update(exp=1),
        lambda claims: claims.update(iss="https://wrong.example/auth/v1"),
        lambda claims: claims.update(aud="wrong"),
        lambda claims: claims.pop("sub"),
        lambda claims: claims.update(sub="not-a-uuid"),
    ],
)
def test_invalid_registered_claims_return_401(mutate, auth_context):
    claims = base_claims()
    mutate(claims)
    token = signed_token(auth_context[1], claims=claims)
    assert (
        auth_context[0].get("/api/v1/auth/me", headers=authorization(token)).status_code
        == 401
    )


def test_unknown_kid_refreshes_once_then_returns_401(auth_context):
    token = signed_token(auth_context[1], kid="unknown-key")
    assert (
        auth_context[0].get("/api/v1/auth/me", headers=authorization(token)).status_code
        == 401
    )
    assert auth_context[2]["value"] == 2


def test_alg_none_is_rejected(auth_context):
    token = jwt.encode(
        base_claims(), key="", algorithm="none", headers={"kid": "test-key"}
    )
    assert (
        auth_context[0].get("/api/v1/auth/me", headers=authorization(token)).status_code
        == 401
    )


def test_unexpected_symmetric_algorithm_is_rejected(auth_context):
    token = jwt.encode(
        base_claims(),
        key="test-secret-that-is-at-least-32-bytes",
        algorithm="HS256",
        headers={"kid": "test-key"},
    )
    assert (
        auth_context[0].get("/api/v1/auth/me", headers=authorization(token)).status_code
        == 401
    )


def test_valid_token_returns_only_sanitized_identity(auth_context):
    claims = base_claims()
    token = signed_token(auth_context[1], claims=claims)
    response = auth_context[0].get(
        "/api/v1/auth/me",
        headers=authorization(token),
    )
    assert response.status_code == 200
    assert response.json() == {
        "id": claims["sub"],
        "email": "student@example.test",
        "audience": AUDIENCE,
        "token_role": "authenticated",
    }
    assert token not in response.text
    assert "signature" not in response.text.lower()


def test_jwks_is_cached_between_valid_requests(auth_context):
    token = signed_token(auth_context[1])
    assert (
        auth_context[0].get("/api/v1/auth/me", headers=authorization(token)).status_code
        == 200
    )
    assert (
        auth_context[0].get("/api/v1/auth/me", headers=authorization(token)).status_code
        == 200
    )
    assert auth_context[2]["value"] == 1


def test_invalid_email_claim_is_rejected(auth_context):
    claims = base_claims()
    claims["email"] = "not-an-email"
    response = auth_context[0].get(
        "/api/v1/auth/me",
        headers=authorization(signed_token(auth_context[1], claims=claims)),
    )
    assert response.status_code == 401


def test_jwks_outage_returns_controlled_503(monkeypatch: pytest.MonkeyPatch):
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    monkeypatch.setattr(
        JwksClient,
        "_fetch",
        lambda _self: (_ for _ in ()).throw(JwksUnavailableError("offline")),
    )
    settings = Settings(
        _env_file=None,
        environment="test",
        supabase_jwks_url=JWKS_URL,
        supabase_issuer=ISSUER,
    )
    with TestClient(create_app(settings)) as client:
        response = client.get(
            "/api/v1/auth/me", headers=authorization(signed_token(private_key))
        )
    assert response.status_code == 503
    assert response.json() == {
        "error": {
            "status": 503,
            "message": "Authentication service temporarily unavailable",
        }
    }


def test_public_endpoints_remain_public(auth_context):
    client = auth_context[0]
    assert client.get("/api/v1/health").status_code == 200
    assert client.get("/api/v1/catalog/modules").status_code == 200
    assert client.get("/api/v1/bibliography/resources").status_code == 200


def test_openapi_declares_bearer_security(auth_context):
    document = auth_context[0].get("/openapi.json").json()
    assert document["components"]["securitySchemes"]["SupabaseBearer"] == {
        "type": "http",
        "scheme": "bearer",
    }
    assert document["paths"]["/api/v1/auth/me"]["get"]["security"] == [
        {"SupabaseBearer": []}
    ]


def test_cors_preflight_allows_authorization_header(auth_context):
    response = auth_context[0].options(
        "/api/v1/auth/me",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization",
        },
    )
    assert response.status_code == 200
    assert "authorization" in response.headers["access-control-allow-headers"].lower()


@pytest.mark.parametrize(
    "url",
    ["http://remote.example/auth/v1", "https://user:password@remote.example/auth/v1"],
)
def test_supabase_security_urls_reject_insecure_values(url):
    with pytest.raises(ValidationError):
        Settings(_env_file=None, supabase_jwks_url=url)
