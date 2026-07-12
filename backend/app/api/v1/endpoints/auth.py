"""Protected identity endpoint; Supabase Auth owns login and signup."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.domains.auth.dependencies import get_current_user
from app.schemas.auth import AuthMeResponse, CurrentUser

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get(
    "/me", response_model=AuthMeResponse, summary="Return the authenticated identity"
)
def auth_me(
    current_user: Annotated[CurrentUser, Depends(get_current_user)],
) -> AuthMeResponse:
    return AuthMeResponse(**current_user.model_dump())
