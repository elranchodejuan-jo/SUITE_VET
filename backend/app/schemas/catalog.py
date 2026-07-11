"""Strict contracts for the versioned Suite Vet module catalog."""

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

Identifier = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        min_length=2,
        max_length=64,
        pattern=r"^[a-z][a-z0-9-]*$",
    ),
]
Version = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        pattern=r"^\d+\.\d+\.\d+$",
    ),
]


class ModuleType(str, Enum):
    PRIMARY = "primary"
    AUXILIARY = "auxiliary"
    PLANNED = "planned"


class ModuleStatus(str, Enum):
    ACTIVE = "active"
    DISABLED = "disabled"
    FUTURE = "future"


class ViewRoute(str, Enum):
    HOME = "home"
    FISIOLOGIA = "fisiologia"
    FARMACOLOGIA = "farmacologia"
    MICROBIOLOGIA = "microbiologia"
    PATOLOGIA = "patologia"
    NUTRICION = "nutricion"
    CLINICA = "clinica"
    SEMIOLOGIA = "semiologia"
    CASOS_360 = "casos360"
    ONCOLOGIA = "oncologia"
    BIBLIOGRAFIA = "bibliografia"
    FAVORITOS = "favoritos"
    ABOUT = "about"


class ThemeId(str, Enum):
    ACCENT = "accent"
    FISIO = "fisio"
    FARMA = "farma"
    MICRO = "micro"
    PATO = "pato"
    NUTRI = "nutri"
    CLINICA = "clinica"
    SEMIOLOGIA = "semiologia"
    CASOS_360 = "casos360"
    ONCO = "onco"
    BIBLIO = "biblio"
    FAVORITOS = "favoritos"
    MUTED = "muted"


class IconId(str, Enum):
    HOME = "home"
    PHYSIOLOGY = "physiology"
    PHARMACOLOGY = "pharmacology"
    MICROBIOLOGY = "microbiology"
    PATHOLOGY = "pathology"
    NUTRITION = "nutrition"
    CLINIC = "clinic"
    SEMIOLOGY = "semiology"
    CASES_360 = "cases360"
    ONCOLOGY = "oncology"
    BIBLIOGRAPHY = "bibliography"
    FAVORITES = "favorites"
    ABOUT = "about"
    RECIPE = "recipe"
    CARTILLA = "cartilla"
    CATTLE = "cattle"


class CatalogItem(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        frozen=True,
        json_schema_extra={
            "examples": [
                {
                    "id": "fisio",
                    "slug": "fisiologia",
                    "name": "Fisiología",
                    "short_name": "Fisiología",
                    "description": "Hormonas, vitaminas y glosario",
                    "home_description": "Hormonas, vitaminas y glosario clínico por sistema.",
                    "badge": None,
                    "route": "fisiologia",
                    "type": "primary",
                    "status": "active",
                    "order": 10,
                    "searchable": True,
                    "visible_on_home": True,
                    "visible_in_sidebar": True,
                    "theme": "fisio",
                    "icon_id": "physiology",
                }
            ]
        },
    )

    id: Identifier
    slug: Identifier
    name: Annotated[str, StringConstraints(strict=True, strip_whitespace=True, min_length=1, max_length=80)]
    short_name: Annotated[str, StringConstraints(strict=True, strip_whitespace=True, min_length=1, max_length=40)]
    description: Annotated[str, StringConstraints(strict=True, strip_whitespace=True, min_length=1, max_length=180)]
    home_description: Annotated[str, StringConstraints(strict=True, strip_whitespace=True, min_length=1, max_length=220)] | None = None
    badge: Annotated[str, StringConstraints(strict=True, strip_whitespace=True, min_length=1, max_length=32)] | None = None
    route: ViewRoute | None
    type: ModuleType
    status: ModuleStatus
    order: StrictInt = Field(ge=0, le=10_000)
    searchable: StrictBool
    visible_on_home: StrictBool
    visible_in_sidebar: StrictBool
    theme: ThemeId
    icon_id: IconId

    @field_validator("name", "short_name", "description", "home_description", "badge")
    @classmethod
    def reject_executable_text(cls, value: str | None) -> str | None:
        if value is None:
            return value
        lowered = value.casefold()
        forbidden = ("<", ">", "javascript:", "onerror", "onload")
        if any(marker in lowered for marker in forbidden):
            raise ValueError("catalog text contains forbidden executable markup")
        return value

    @model_validator(mode="after")
    def validate_visibility_contract(self) -> "CatalogItem":
        if self.visible_on_home and self.home_description is None:
            raise ValueError("home_description is required for home entries")
        if self.status is ModuleStatus.ACTIVE and (
            self.visible_on_home or self.visible_in_sidebar
        ) and self.route is None:
            raise ValueError("visible active entries require an internal route")
        if self.type is ModuleType.PLANNED and self.status is ModuleStatus.ACTIVE:
            raise ValueError("planned integrations cannot be active")
        return self

class CatalogDocument(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    schema_version: Version
    catalog_version: Version
    items: list[CatalogItem]

    @model_validator(mode="after")
    def validate_unique_keys(self) -> "CatalogDocument":
        ids = [item.id for item in self.items]
        slugs = [item.slug for item in self.items]
        routes = [item.route.value for item in self.items if item.route is not None]
        if len(ids) != len(set(ids)):
            raise ValueError("catalog IDs must be unique")
        if len(slugs) != len(set(slugs)):
            raise ValueError("catalog slugs must be unique")
        if len(routes) != len(set(routes)):
            raise ValueError("catalog routes must be unique")
        return self


class CatalogListResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    schema_version: Version
    catalog_version: Version
    source: Literal["static"]
    total: StrictInt = Field(ge=0)
    items: list[CatalogItem]

    @model_validator(mode="after")
    def validate_total(self) -> "CatalogListResponse":
        if self.total != len(self.items):
            raise ValueError("catalog total must match item count")
        return self
