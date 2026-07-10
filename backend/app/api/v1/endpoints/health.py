"""Process-level health endpoint."""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.core.config import Settings, get_request_settings
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    tags=["System"],
    summary="Check API process health",
    description="Reports only the Suite Vet API process state; no external services are queried.",
)
def health_check(
    settings: Annotated[Settings, Depends(get_request_settings)],
) -> HealthResponse:
    return HealthResponse(
        status="ok",
        service=settings.service_name,
        version=settings.app_version,
        environment=settings.environment,
    )
