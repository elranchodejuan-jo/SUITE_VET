"""REST boundary for the academic bibliography domain."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.domains.bibliography.repository import (
    BibliographyRepository,
    BibliographyRepositoryError,
)
from app.domains.bibliography.service import (
    BibliographyNotFoundError,
    BibliographyService,
)
from app.schemas.bibliography import BibliographyListResponse, BibliographyResource

router = APIRouter(prefix="/bibliography", tags=["Bibliography"])


def get_bibliography_repository(request: Request) -> BibliographyRepository:
    return request.app.state.bibliography_repository


def get_bibliography_service(
    repository: Annotated[BibliographyRepository, Depends(get_bibliography_repository)],
) -> BibliographyService:
    return BibliographyService(repository)


@router.get(
    "/resources",
    response_model=BibliographyListResponse,
    summary="List registered academic bibliography resources",
    description="Lists safe metadata only; binary assets remain served by the static frontend.",
)
def list_resources(
    service: Annotated[BibliographyService, Depends(get_bibliography_service)],
) -> BibliographyListResponse:
    try:
        document = service.list_resources()
    except BibliographyRepositoryError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Bibliography catalog is unavailable",
        ) from exc
    return BibliographyListResponse(
        schema_version=document.schema_version,
        catalog_version=document.catalog_version,
        source="static",
        total=len(document.items),
        items=document.items,
    )


@router.get(
    "/resources/{slug}",
    response_model=BibliographyResource,
    summary="Get one academic bibliography resource",
)
def get_resource(
    slug: str,
    service: Annotated[BibliographyService, Depends(get_bibliography_service)],
) -> BibliographyResource:
    try:
        return service.get_resource(slug)
    except BibliographyNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bibliography resource not found",
        ) from exc
    except BibliographyRepositoryError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Bibliography catalog is unavailable",
        ) from exc
