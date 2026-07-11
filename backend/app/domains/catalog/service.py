"""Framework-independent application service for module discovery."""

from dataclasses import dataclass

from app.domains.catalog.repository import CatalogRepository
from app.schemas.catalog import CatalogDocument, CatalogItem


class CatalogNotFoundError(LookupError):
    """Raised when a requested module is not registered."""


@dataclass(frozen=True, slots=True)
class CatalogService:
    repository: CatalogRepository

    def list_modules(self) -> CatalogDocument:
        return self.repository.list_modules()

    def get_module(self, slug: str) -> CatalogItem:
        item = self.repository.get_module(slug)
        if item is None:
            raise CatalogNotFoundError(slug)
        return item
