"""Contract and infrastructure tests for Hito 2.1."""

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.core.config import Settings, get_settings
from app.main import create_app


def test_health_contract(client: TestClient) -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("application/json")
    assert response.json() == {
        "status": "ok",
        "service": "suite-vet-api",
        "version": "0.1.0",
        "environment": "test",
    }


def test_openapi_documents_health(client: TestClient) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    document = response.json()
    assert document["info"]["title"] == "Suite Vet API"
    assert document["info"]["version"] == "0.1.0"
    assert "/api/v1/health" in document["paths"]
    operation = document["paths"]["/api/v1/health"]["get"]
    assert "System" in operation["tags"]


def test_swagger_is_available_outside_production(client: TestClient) -> None:
    response = client.get("/docs")

    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]


def test_unknown_route_returns_json_404(client: TestClient) -> None:
    response = client.get("/api/v1/not-found")

    assert response.status_code == 404
    assert response.headers["content-type"].startswith("application/json")
    assert response.json() == {
        "error": {"status": 404, "message": "Not Found"}
    }


def test_settings_are_replaceable_in_the_factory() -> None:
    settings = Settings(
        _env_file=None,
        app_version="9.9.9-test",
        environment="test",
    )

    with TestClient(create_app(settings)) as client:
        response = client.get("/api/v1/health")

    assert response.json()["version"] == "9.9.9-test"
    assert response.json()["environment"] == "test"


def test_settings_loader_reads_environment_once(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("SUITEVET_ENVIRONMENT", "test")
    get_settings.cache_clear()
    try:
        first = get_settings()
        second = get_settings()

        assert first.environment == "test"
        assert first is second
    finally:
        get_settings.cache_clear()


def test_cors_allows_the_vite_localhost_origin(client: TestClient) -> None:
    response = client.options(
        "/api/v1/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    assert response.headers.get("access-control-allow-credentials") is None


def test_cors_rejects_unknown_origins(client: TestClient) -> None:
    response = client.get(
        "/api/v1/health",
        headers={"Origin": "https://example.invalid"},
    )

    assert response.status_code == 200
    assert "access-control-allow-origin" not in response.headers


def test_wildcard_cors_configuration_is_rejected() -> None:
    with pytest.raises(ValidationError, match="wildcard CORS origins"):
        Settings(_env_file=None, cors_origins=["*"])
