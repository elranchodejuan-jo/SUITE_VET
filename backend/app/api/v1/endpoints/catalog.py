"""REST boundary for the Catalog domain."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.domains.catalog.repository import CatalogRepository, CatalogRepositoryError
from app.domains.catalog.service import CatalogNotFoundError, CatalogService
from app.schemas.catalog import CatalogItem, CatalogListResponse

router = APIRouter(prefix="/catalog", tags=["Catalog"])


def get_catalog_repository(request: Request) -> CatalogRepository:
    return request.app.state.catalog_repository


def get_catalog_service(
    repository: Annotated[CatalogRepository, Depends(get_catalog_repository)],
) -> CatalogService:
    return CatalogService(repository)


@router.get(
    "/modules",
    response_model=CatalogListResponse,
    summary="List registered Suite Vet modules",
)
def list_modules(
    service: Annotated[CatalogService, Depends(get_catalog_service)],
) -> CatalogListResponse:
    try:
        catalog = service.list_modules()
    except CatalogRepositoryError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Module catalog is unavailable",
        ) from exc
    return CatalogListResponse(
        schema_version=catalog.schema_version,
        catalog_version=catalog.catalog_version,
        source="static",
        total=len(catalog.items),
        items=catalog.items,
    )


@router.get(
    "/modules/{slug}",
    response_model=CatalogItem,
    summary="Get one registered Suite Vet module",
)
def get_module(
    slug: str,
    service: Annotated[CatalogService, Depends(get_catalog_service)],
) -> CatalogItem:
    try:
        return service.get_module(slug)
    except CatalogNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found",
        ) from exc
    except CatalogRepositoryError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Module catalog is unavailable",
        ) from exc
