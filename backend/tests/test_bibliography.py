"""Bibliography domain, repository, API and safety tests."""

import json
from copy import deepcopy
from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.v1.endpoints.bibliography import get_bibliography_repository
from app.domains.bibliography.repository import (
    BibliographyRepositoryError,
    JsonBibliographyRepository,
)
from app.schemas.bibliography import BibliographyDocument

BIBLIOGRAPHY_PATH = Path(__file__).resolve().parents[1] / "app" / "data" / "bibliography.json"


def authoritative_payload() -> dict[str, object]:
    return json.loads(BIBLIOGRAPHY_PATH.read_text(encoding="utf-8"))


def write_payload(path: Path, payload: object) -> Path:
    path.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    return path


class InMemoryBibliographyRepository:
    def __init__(self, document: BibliographyDocument) -> None:
        self.document = document

    def list_resources(self) -> BibliographyDocument:
        return self.document

    def get_resource(self, slug: str):
        key = slug.casefold()
        return next(
            (item for item in self.document.items if item.slug.casefold() == key or item.id.casefold() == key),
            None,
        )


class FailingBibliographyRepository:
    def list_resources(self) -> BibliographyDocument:
        raise BibliographyRepositoryError("controlled failure")

    def get_resource(self, _slug: str):
        raise BibliographyRepositoryError("controlled failure")


def test_bibliography_list_contract(client: TestClient) -> None:
    response = client.get("/api/v1/bibliography/resources")

    assert response.status_code == 200
    payload = response.json()
    assert payload["schema_version"] == "1.0.0"
    assert payload["catalog_version"] == "2.3.0"
    assert payload["source"] == "static"
    assert payload["total"] == 1 == len(payload["items"])


def test_bibliography_order_ids_and_slugs_are_deterministic(client: TestClient) -> None:
    items = client.get("/api/v1/bibliography/resources").json()["items"]
    ids = [item["id"] for item in items]
    slugs = [item["slug"] for item in items]

    assert ids == sorted(ids, key=str.casefold)
    assert len(ids) == len(set(ids))
    assert len(slugs) == len(set(slugs))


def test_bibliography_detail_existing_and_id_lookup(client: TestClient) -> None:
    slug_response = client.get("/api/v1/bibliography/resources/fisiologia-animal-1")
    id_response = client.get("/api/v1/bibliography/resources/FISIOLOGIA-ANIMAL-1")

    assert slug_response.status_code == 200
    assert id_response.status_code == 200
    assert slug_response.json()["asset_key"] == "fisiologia-animal-i-pdf"
    assert slug_response.json()["rights_status"] == "unverified"


def test_bibliography_detail_missing_returns_consistent_json(client: TestClient) -> None:
    response = client.get("/api/v1/bibliography/resources/no-existe")

    assert response.status_code == 404
    assert response.json() == {
        "error": {"status": 404, "message": "Bibliography resource not found"}
    }


def test_openapi_contains_bibliography_endpoints(client: TestClient) -> None:
    paths = client.get("/openapi.json").json()["paths"]

    assert "/api/v1/bibliography/resources" in paths
    assert "/api/v1/bibliography/resources/{slug}" in paths
    assert "Bibliography" in paths["/api/v1/bibliography/resources"]["get"]["tags"]


def test_repository_caches_validated_file(tmp_path: Path) -> None:
    path = write_payload(tmp_path / "bibliography.json", authoritative_payload())
    repository = JsonBibliographyRepository(path)
    first = repository.list_resources()
    path.write_text("not json", encoding="utf-8")

    assert repository.list_resources() is first


def test_missing_bibliography_file_fails_controlled(tmp_path: Path) -> None:
    with pytest.raises(BibliographyRepositoryError, match="unavailable"):
        JsonBibliographyRepository(tmp_path / "missing.json").list_resources()


@pytest.mark.parametrize(
    "mutation",
    [
        lambda payload: payload.update({"unexpected": True}),
        lambda payload: payload["items"][0].update({"unexpected": True}),
        lambda payload: payload["items"][0].update({"title": "<img onerror=alert(1)>"}),
        lambda payload: payload["items"][0].update({"citation_apa": "javascript:alert(1)"}),
        lambda payload: payload["items"][0].update({"asset_key": "../outside.pdf"}),
        lambda payload: payload["items"][0].update({"asset_key": "https://example.invalid/file.pdf"}),
        lambda payload: payload["items"][0].update({"slug": "Other"}),
        lambda payload: payload["items"].append(deepcopy(payload["items"][0])),
        lambda payload: payload["items"][0].update({"authors": ["A"] * 11}),
        lambda payload: payload["items"][0].update({"topics": ["x"] * 13}),
    ],
    ids=[
        "document-extra-field",
        "resource-extra-field",
        "html-onerror",
        "javascript-citation",
        "path-traversal",
        "external-asset-url",
        "invalid-slug-shape",
        "duplicate-id-and-slug",
        "too-many-authors",
        "too-many-topics",
    ],
)
def test_invalid_bibliography_payloads_fail_controlled(tmp_path: Path, mutation) -> None:
    payload = deepcopy(authoritative_payload())
    mutation(payload)

    with pytest.raises(BibliographyRepositoryError, match="invalid"):
        JsonBibliographyRepository(write_payload(tmp_path / "invalid.json", payload)).list_resources()


def test_nullable_validated_year_and_citations_are_preserved(tmp_path: Path) -> None:
    payload = authoritative_payload()
    payload["items"][0]["year"] = None
    repository = JsonBibliographyRepository(write_payload(tmp_path / "nullable-year.json", payload))

    resource = repository.get_resource("fisiologia-animal-1")

    assert resource is not None
    assert resource.year is None
    assert resource.citation_apa
    assert resource.citation_vancouver


def test_invalid_year_fails_controlled(tmp_path: Path) -> None:
    payload = authoritative_payload()
    payload["items"][0]["year"] = 1200

    with pytest.raises(BibliographyRepositoryError, match="invalid"):
        JsonBibliographyRepository(write_payload(tmp_path / "invalid-year.json", payload)).list_resources()


def test_rights_and_review_statuses_are_explicit(tmp_path: Path) -> None:
    payload = authoritative_payload()
    resource = payload["items"][0]
    assert resource["review_status"] == "draft"
    assert resource["rights_status"] == "unverified"
    assert resource["source_status"] == "unverified"

    resource["rights_status"] = "verified"
    with pytest.raises(BibliographyRepositoryError, match="invalid"):
        JsonBibliographyRepository(write_payload(tmp_path / "invalid-rights.json", payload)).list_resources()


def test_dependency_override_supports_replaceable_repository(application: FastAPI) -> None:
    empty = BibliographyDocument(schema_version="1.0.0", catalog_version="2.3.0", items=[])
    application.dependency_overrides[get_bibliography_repository] = lambda: InMemoryBibliographyRepository(empty)
    try:
        with TestClient(application) as client:
            response = client.get("/api/v1/bibliography/resources")
    finally:
        application.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["total"] == 0


def test_repository_failure_returns_503(application: FastAPI) -> None:
    application.dependency_overrides[get_bibliography_repository] = FailingBibliographyRepository
    try:
        with TestClient(application) as client:
            list_response = client.get("/api/v1/bibliography/resources")
            detail_response = client.get("/api/v1/bibliography/resources/fisiologia-animal-1")
    finally:
        application.dependency_overrides.clear()

    assert list_response.status_code == 503
    assert detail_response.status_code == 503
    assert list_response.json()["error"]["message"] == "Bibliography catalog is unavailable"


def test_health_and_module_catalog_remain_available(client: TestClient) -> None:
    assert client.get("/api/v1/health").status_code == 200
    assert client.get("/api/v1/catalog/modules").json()["total"] == 16
