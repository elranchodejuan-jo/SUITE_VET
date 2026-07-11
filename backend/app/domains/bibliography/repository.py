"""Static repository and replacement contract for bibliography resources."""

import json
from pathlib import Path
from threading import Lock
from typing import Protocol

from pydantic import ValidationError

from app.schemas.bibliography import BibliographyDocument, BibliographyResource

DEFAULT_BIBLIOGRAPHY_PATH = Path(__file__).resolve().parents[2] / "data" / "bibliography.json"


class BibliographyRepositoryError(RuntimeError):
    """Raised when the bibliography source cannot be loaded or validated."""


class BibliographyRepository(Protocol):
    def list_resources(self) -> BibliographyDocument:
        """Return the complete validated bibliography catalog."""

    def get_resource(self, slug: str) -> BibliographyResource | None:
        """Return one resource by slug or stable ID."""


class JsonBibliographyRepository:
    """Load and cache the authoritative bibliography JSON once per process."""

    def __init__(self, path: Path | str = DEFAULT_BIBLIOGRAPHY_PATH) -> None:
        self._path = Path(path)
        self._document: BibliographyDocument | None = None
        self._lock = Lock()

    def list_resources(self) -> BibliographyDocument:
        return self._load()

    def get_resource(self, slug: str) -> BibliographyResource | None:
        lookup = slug.strip().casefold()
        for item in self._load().items:
            if item.slug.casefold() == lookup or item.id.casefold() == lookup:
                return item
        return None

    def _load(self) -> BibliographyDocument:
        if self._document is not None:
            return self._document

        with self._lock:
            if self._document is not None:
                return self._document
            try:
                payload = json.loads(self._path.read_text(encoding="utf-8"))
            except FileNotFoundError as exc:
                raise BibliographyRepositoryError("bibliography source is unavailable") from exc
            except (OSError, json.JSONDecodeError) as exc:
                raise BibliographyRepositoryError("bibliography source could not be read") from exc

            try:
                document = BibliographyDocument.model_validate(payload)
            except ValidationError as exc:
                raise BibliographyRepositoryError("bibliography source is invalid") from exc

            ordered = sorted(document.items, key=lambda item: (item.title.casefold(), item.slug))
            self._document = document.model_copy(update={"items": ordered})
            return self._document
