"""Framework-independent use cases for bibliography discovery."""

from dataclasses import dataclass

from app.domains.bibliography.repository import BibliographyRepository
from app.schemas.bibliography import BibliographyDocument, BibliographyResource


class BibliographyNotFoundError(LookupError):
    """Raised when a requested bibliography resource is not registered."""


@dataclass(frozen=True, slots=True)
class BibliographyService:
    repository: BibliographyRepository

    def list_resources(self) -> BibliographyDocument:
        return self.repository.list_resources()

    def get_resource(self, slug: str) -> BibliographyResource:
        resource = self.repository.get_resource(slug)
        if resource is None:
            raise BibliographyNotFoundError(slug)
        return resource
