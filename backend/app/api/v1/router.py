"""Composition root for API v1 endpoints."""

from fastapi import APIRouter

from app.api.v1.endpoints import bibliography, catalog, health

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(catalog.router)
api_router.include_router(bibliography.router)
