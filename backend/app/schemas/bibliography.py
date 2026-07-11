"""Strict, versioned contracts for the academic bibliography domain."""

from enum import Enum
from typing import Annotated, Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    StrictBool,
    StrictInt,
    StringConstraints,
    field_validator,
    model_validator,
)

BibliographyIdentifier = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        min_length=2,
        max_length=64,
        pattern=r"^[a-z][a-z0-9-]*$",
    ),
]
BibliographyVersion = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        pattern=r"^\d+\.\d+\.\d+$",
    ),
]
SafeText = Annotated[
    str,
    StringConstraints(strict=True, strip_whitespace=True, min_length=1, max_length=600),
]
ShortText = Annotated[
    str,
    StringConstraints(strict=True, strip_whitespace=True, min_length=1, max_length=120),
]


class ResourceType(str, Enum):
    BOOK = "book"


class ReviewStatus(str, Enum):
    DRAFT = "draft"
    REVIEWED = "reviewed"
    VERIFIED = "verified"


class RightsStatus(str, Enum):
    UNVERIFIED = "unverified"
    OWNED = "owned"
    LICENSED = "licensed"
    PUBLIC_DOMAIN = "public_domain"


class SourceStatus(str, Enum):
    UNVERIFIED = "unverified"
    LOCAL_LEGACY = "local_legacy"


class AssetKey(str, Enum):
    FISIOLOGIA_ANIMAL_I_PDF = "fisiologia-animal-i-pdf"


FORBIDDEN_MARKERS = ("<", ">", "javascript:", "onerror", "onload", "../", "\\")
ALLOWED_MODULE_IDS = {"fisio"}


class BibliographyResource(BaseModel):
    """One safe academic resource; binary assets remain outside the API."""

    model_config = ConfigDict(extra="forbid", frozen=True)

    id: BibliographyIdentifier
    slug: BibliographyIdentifier
    module_id: BibliographyIdentifier
    title: SafeText
    short_title: ShortText | None = None
    authors: list[ShortText] = Field(min_length=1, max_length=10)
    year: StrictInt | None = Field(default=None, ge=1400, le=2100)
    edition: ShortText | None = None
    publisher: ShortText | None = None
    language: ShortText | None = None
    resource_type: ResourceType
    description: SafeText | None = None
    topics: list[ShortText] = Field(default_factory=list, max_length=12)
    species: list[ShortText] = Field(default_factory=list, max_length=12)
    citation_apa: SafeText | None = None
    citation_vancouver: SafeText | None = None
    asset_key: AssetKey | None = None
    file_available: StrictBool
    review_status: ReviewStatus
    rights_status: RightsStatus
    source_status: SourceStatus

    @field_validator(
        "title",
        "short_title",
        "authors",
        "edition",
        "publisher",
        "language",
        "description",
        "topics",
        "species",
        "citation_apa",
        "citation_vancouver",
    )
    @classmethod
    def reject_unsafe_text(cls, value: object) -> object:
        values = value if isinstance(value, list) else [value]
        for item in values:
            if item is None:
                continue
            lowered = str(item).casefold()
            if any(marker in lowered for marker in FORBIDDEN_MARKERS):
                raise ValueError("bibliography text contains forbidden markup or path data")
        return value

    @model_validator(mode="after")
    def validate_resource_contract(self) -> "BibliographyResource":
        if self.module_id not in ALLOWED_MODULE_IDS:
            raise ValueError("bibliography module_id is not registered")
        if self.file_available != (self.asset_key is not None):
            raise ValueError("file_available must match the presence of asset_key")
        if len(set(self.authors)) != len(self.authors):
            raise ValueError("bibliography authors must be unique")
        if len(set(self.topics)) != len(self.topics):
            raise ValueError("bibliography topics must be unique")
        if len(set(self.species)) != len(self.species):
            raise ValueError("bibliography species must be unique")
        return self


class BibliographyDocument(BaseModel):
    """Authoritative static bibliography source."""

    model_config = ConfigDict(extra="forbid", frozen=True)

    schema_version: BibliographyVersion
    catalog_version: BibliographyVersion
    items: list[BibliographyResource]

    @model_validator(mode="after")
    def validate_unique_keys(self) -> "BibliographyDocument":
        ids = [item.id for item in self.items]
        slugs = [item.slug for item in self.items]
        if len(ids) != len(set(ids)):
            raise ValueError("bibliography IDs must be unique")
        if len(slugs) != len(set(slugs)):
            raise ValueError("bibliography slugs must be unique")
        return self


class BibliographyListResponse(BaseModel):
    """Public list response for the static bibliography catalog."""

    model_config = ConfigDict(extra="forbid", frozen=True)

    schema_version: BibliographyVersion
    catalog_version: BibliographyVersion
    source: Literal["static"]
    total: StrictInt = Field(ge=0)
    items: list[BibliographyResource]

    @model_validator(mode="after")
    def validate_total(self) -> "BibliographyListResponse":
        if self.total != len(self.items):
            raise ValueError("bibliography total must match item count")
        return self
