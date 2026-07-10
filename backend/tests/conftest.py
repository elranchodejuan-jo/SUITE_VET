"""Shared test fixtures for the isolated FastAPI application."""

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app


@pytest.fixture
def test_settings() -> Settings:
    return Settings(_env_file=None, environment="test", debug=False)


@pytest.fixture
def application(test_settings: Settings) -> FastAPI:
    return create_app(test_settings)


@pytest.fixture
def client(application: FastAPI):
    with TestClient(application) as test_client:
        yield test_client
