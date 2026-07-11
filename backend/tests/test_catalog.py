"""Catalog domain, repository, dependency and REST contract tests."""

import json
from copy import deepcopy
from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.v1.endpoints.catalog import get_catalog_repository
from app.domains.catalog.repository import (
    CatalogRepositoryError,
    JsonCatalogRepository,
)
from app.schemas.catalog import CatalogDocument

CATALOG_PATH = Path(__file__).resolve().parents[1] / "app" / "data" / "modules.json"


def authoritative_payload() -> dict[str, object]:
    return json.loads(CATALOG_PATH.read_text(encoding="utf-8"))


def write_payload(path: Path, payload: object) -> Path:
    path.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    return path


class InMemoryCatalogRepository:
    def __init__(self, document: CatalogDocument) -> None:
        self.document = document

    def list_modules(self) -> CatalogDocument:
        return self.document

    def get_module(self, slug: str):
        lookup = slug.casefold()
        return next(
            (
                item
                for item in self.document.items
                if item.slug.casefold() == lookup or item.id.casefold() == lookup
            ),
            None,
        )


class FailingCatalogRepository:
    def list_modules(self) -> CatalogDocument:
        raise CatalogRepositoryError("controlled failure")

    def get_module(self, _slug: str):
        raise CatalogRepositoryError("controlled failure")


def test_catalog_list_contract(client: TestClient) -> None:
    response = client.get("/api/v1/catalog/modules")

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("application/json")
    payload = response.json()
    assert payload["schema_version"] == "1.0.0"
    assert payload["catalog_version"] == "2.2.0"
    assert payload["source"] == "static"
    assert payload["total"] == 16 == len(payload["items"])


def test_catalog_keys_routes_and_order_are_deterministic(client: TestClient) -> None:
    items = client.get("/api/v1/catalog/modules").json()["items"]
    ids = [item["id"] for item in items]
    slugs = [item["slug"] for item in items]
    routes = [item["route"] for item in items if item["route"] is not None]
    order = [(item["order"], item["slug"]) for item in items]

    assert len(ids) == len(set(ids))
    assert len(slugs) == len(set(slugs))
    assert len(routes) == len(set(routes))
    assert order == sorted(order)
    assert set(routes) == {
        "home",
        "fisiologia",
        "farmacologia",
        "microbiologia",
        "patologia",
        "nutricion",
        "clinica",
        "semiologia",
        "casos360",
        "oncologia",
        "bibliografia",
        "favoritos",
        "about",
    }


def test_catalog_detail_existing(client: TestClient) -> None:
    response = client.get("/api/v1/catalog/modules/vetonco")

    assert response.status_code == 200
    assert response.json()["id"] == "oncologia"
    assert response.json()["route"] == "oncologia"


def test_catalog_detail_missing_returns_consistent_json(client: TestClient) -> None:
    response = client.get("/api/v1/catalog/modules/no-existe")

    assert response.status_code == 404
    assert response.json() == {
        "error": {"status": 404, "message": "Module not found"}
    }


def test_openapi_contains_catalog_endpoints(client: TestClient) -> None:
    paths = client.get("/openapi.json").json()["paths"]

    assert "/api/v1/catalog/modules" in paths
    assert "/api/v1/catalog/modules/{slug}" in paths
    assert "Catalog" in paths["/api/v1/catalog/modules"]["get"]["tags"]


def test_repository_caches_validated_file(tmp_path: Path) -> None:
    path = write_payload(tmp_path / "modules.json", authoritative_payload())
    repository = JsonCatalogRepository(path)
    first = repository.list_modules()
    path.write_text("not json", encoding="utf-8")

    second = repository.list_modules()

    assert first is second
    assert len(second.items) == 16


def test_missing_catalog_file_fails_controlled(tmp_path: Path) -> None:
    repository = JsonCatalogRepository(tmp_path / "missing.json")

    with pytest.raises(CatalogRepositoryError, match="unavailable"):
        repository.list_modules()


@pytest.mark.parametrize(
    "mutation",
    [
        lambda payload: payload.update({"unexpected": True}),
        lambda payload: payload["items"][0].update({"unexpected": True}),
        lambda payload: payload["items"][1].update({"name": "<img onerror=alert(1)>"}),
        lambda payload: payload["items"][1].update({"route": "javascript:alert(1)"}),
        lambda payload: payload["items"][1].update({"theme": "red; background:url(x)"}),
        lambda payload: payload["items"][1].update({"slug": payload["items"][0]["slug"]}),
        lambda payload: payload["items"][1].update({"id": payload["items"][0]["id"]}),
        lambda payload: payload["items"][1].update({"route": payload["items"][0]["route"]}),
    ],
    ids=[
        "document-extra-field",
        "item-extra-field",
        "html-onerror",
        "javascript-route",
        "css-injection",
        "duplicate-slug",
        "duplicate-id",
        "duplicate-route",
    ],
)
def test_invalid_catalog_payloads_fail_controlled(tmp_path: Path, mutation) -> None:
    payload = deepcopy(authoritative_payload())
    mutation(payload)
    repository = JsonCatalogRepository(write_payload(tmp_path / "invalid.json", payload))

    with pytest.raises(CatalogRepositoryError, match="invalid"):
        repository.list_modules()


def test_dependency_override_supports_empty_repository(application: FastAPI) -> None:
    empty = CatalogDocument(
        schema_version="1.0.0",
        catalog_version="2.2.0",
        items=[],
    )
    application.dependency_overrides[get_catalog_repository] = lambda: InMemoryCatalogRepository(empty)
    try:
        with TestClient(application) as client:
            response = client.get("/api/v1/catalog/modules")
    finally:
        application.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["total"] == 0
    assert response.json()["items"] == []


def test_dependency_override_exposes_controlled_repository_failure(
    application: FastAPI,
) -> None:
    application.dependency_overrides[get_catalog_repository] = FailingCatalogRepository
    try:
        with TestClient(application) as client:
            list_response = client.get("/api/v1/catalog/modules")
            detail_response = client.get("/api/v1/catalog/modules/fisiologia")
    finally:
        application.dependency_overrides.clear()

    assert list_response.status_code == 503
    assert detail_response.status_code == 503
    assert list_response.json()["error"]["message"] == "Module catalog is unavailable"
