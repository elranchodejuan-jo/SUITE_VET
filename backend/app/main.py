"""FastAPI application factory and default ASGI entrypoint."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import Settings, get_settings
from app.core.errors import register_error_handlers
from app.domains.bibliography.repository import (
    BibliographyRepository,
    JsonBibliographyRepository,
)
from app.domains.catalog.repository import CatalogRepository, JsonCatalogRepository

API_DESCRIPTION = (
    "Versioned domain boundary for Suite Vet. It exposes infrastructure health "
    "and static academic catalogs; veterinary data remains in the frontend."
)


def create_app(
    settings: Settings | None = None,
    catalog_repository: CatalogRepository | None = None,
    bibliography_repository: BibliographyRepository | None = None,
) -> FastAPI:
    runtime_settings = settings if settings is not None else get_settings()
    docs_enabled = runtime_settings.environment != "production"

    application = FastAPI(
        title=runtime_settings.app_name,
        version=runtime_settings.app_version,
        description=API_DESCRIPTION,
        debug=runtime_settings.debug,
        docs_url="/docs" if docs_enabled else None,
        redoc_url=None,
        openapi_url="/openapi.json",
    )
    application.state.settings = runtime_settings
    application.state.catalog_repository = (
        catalog_repository if catalog_repository is not None else JsonCatalogRepository()
    )
    application.state.bibliography_repository = (
        bibliography_repository
        if bibliography_repository is not None
        else JsonBibliographyRepository()
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=runtime_settings.cors_origins,
        allow_credentials=False,
        allow_methods=["GET", "OPTIONS"],
        allow_headers=["Accept", "Content-Type"],
    )
    register_error_handlers(application)
    application.include_router(
        api_router,
        prefix=runtime_settings.api_v1_prefix,
    )
    return application


app = create_app()
