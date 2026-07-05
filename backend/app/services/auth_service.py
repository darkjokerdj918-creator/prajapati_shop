"""Service — Auth business logic"""
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.core.database import get_db
from app.repositories.user_repo import user_repo
from app.schemas.user import UserRegister, UserLogin, TokenResponse, UserOut
from app.models.user import User

bearer_scheme = HTTPBearer(auto_error=False)


class AuthService:

    def register(self, db: Session, data: UserRegister) -> TokenResponse:
        if user_repo.get_by_email(db, data.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists"
            )
        hashed = hash_password(data.password)
        user = user_repo.create(db, data.full_name, data.email, hashed, data.phone)
        token = create_access_token({"sub": str(user.id), "email": user.email})
        return TokenResponse(
            access_token=token,
            user=UserOut.model_validate(user)
        )

    def login(self, db: Session, data: UserLogin) -> TokenResponse:
        user = user_repo.get_by_email(db, data.email)
        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        token = create_access_token({"sub": str(user.id), "email": user.email})
        return TokenResponse(
            access_token=token,
            user=UserOut.model_validate(user)
        )

    def get_current_user(
        self,
        credentials: Optional[HTTPAuthorizationCredentials],
        db: Session
    ) -> User:
        if not credentials:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
                headers={"WWW-Authenticate": "Bearer"}
            )
        payload = decode_access_token(credentials.credentials)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        user = user_repo.get_by_id(db, int(payload["sub"]))
        if not user or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="User not found or inactive")
        return user

    def get_optional_user(
        self,
        credentials: Optional[HTTPAuthorizationCredentials],
        db: Session
    ) -> Optional[User]:
        """Returns user if token present, None otherwise (for guest support)."""
        if not credentials:
            return None
        payload = decode_access_token(credentials.credentials)
        if not payload:
            return None
        return user_repo.get_by_id(db, int(payload["sub"]))


auth_service = AuthService()


# ── FastAPI Dependencies ────────────────────────────────────

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    return auth_service.get_current_user(credentials, db)


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    return auth_service.get_optional_user(credentials, db)
