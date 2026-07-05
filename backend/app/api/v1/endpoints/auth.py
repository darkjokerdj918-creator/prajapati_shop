"""API v1 — Auth endpoints"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.auth_service import auth_service, get_current_user
from app.schemas.user import UserRegister, UserLogin, TokenResponse, UserOut, UserUpdateRequest, PasswordUpdateRequest
from app.repositories.user_repo import user_repo
from app.models.user import User
from app.core.security import hash_password

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=201,
             summary="Register a new user account")
def register(data: UserRegister, db: Session = Depends(get_db)):
    """Create a new user account and return a JWT access token."""
    return auth_service.register(db, data)


@router.post("/login", response_model=TokenResponse, summary="Login and get access token")
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate with email + password and receive a JWT token."""
    return auth_service.login(db, data)


@router.get("/me", response_model=UserOut, summary="Get current user profile")
def get_me(current_user: User = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return current_user


@router.put("/me", response_model=UserOut, summary="Update user profile")
def update_profile(
    data: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update name, phone, or address for the authenticated user."""
    updated = user_repo.update(
        db, current_user,
        full_name=data.full_name,
        phone=data.phone,
        address=data.address,
    )
    return updated


@router.put("/me/password", summary="Change account password")
def change_password(
    data: PasswordUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update password for the authenticated user."""
    current_user.hashed_password = hash_password(data.password)
    db.commit()
    db.refresh(current_user)
    return {"success": True, "message": "Password updated successfully"}
