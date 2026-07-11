"""Static repository and replacement contract for the Catalog domain."""

import json
from pathlib import Path
from threading import Lock
from typing import Protocol

from pydantic import ValidationError

from app.schemas.catalog import CatalogDocument, CatalogItem

DEFAULT_CATALOG_PATH = Path(__file__).resolve().parents[2] / "data" / "modules.json"


class CatalogRepositoryError(RuntimeError):
    """Raised when the catalog source cannot be loaded or validated."""


class CatalogRepository(Protocol):
    def list_modules(self) -> CatalogDocument:
        """Return the complete validated catalog."""

    def get_module(self, slug: str) -> CatalogItem | None:
        """Return one module by slug or stable ID."""


class JsonCatalogRepository:
    """Load and cache the authoritative packaged JSON catalog."""

    def __init__(self, path: Path | str = DEFAULT_CATALOG_PATH) -> None:
        self._path = Path(path)
        self._catalog: CatalogDocument | None = None
        self._lock = Lock()

    def list_modules(self) -> CatalogDocument:
        return self._load()

    def get_module(self, slug: str) -> CatalogItem | None:
        lookup = slug.strip().casefold()
        for item in self._load().items:
            if item.slug.casefold() == lookup or item.id.casefold() == lookup:
                return item
        return None

    def _load(self) -> CatalogDocument:
        if self._catalog is not None:
            return self._catalog
        with self._lock:
            if self._catalog is not None:
                return self._catalog
            try:
                payload = json.loads(self._path.read_text(encoding="utf-8"))
            except FileNotFoundError as exc:
                raise CatalogRepositoryError("catalog source is unavailable") from exc
            except (OSError, json.JSONDecodeError) as exc:
                raise CatalogRepositoryError("catalog source could not be read") from exc

            try:
                document = CatalogDocument.model_validate(payload)
            except ValidationError as exc:
                raise CatalogRepositoryError("catalog source is invalid") from exc

            ordered = sorted(document.items, key=lambda item: (item.order, item.slug))
            self._catalog = document.model_copy(update={"items": ordered})
            return self._catalog
