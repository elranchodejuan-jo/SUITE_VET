"""FastAPI application factory and default ASGI entrypoint."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import Settings, get_settings
from app.core.errors import register_error_handlers

API_DESCRIPTION = (
    "Versioned domain boundary for Suite Vet. Hito 2.1 exposes infrastructure "
    "health only; veterinary data remains in the existing frontend."
)


def create_app(settings: Settings | None = None) -> FastAPI:
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
