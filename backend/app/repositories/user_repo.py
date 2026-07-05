"""Repository — User DB queries"""
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User


class UserRepository:

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def get_by_id(self, db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    def create(self, db: Session, full_name: str, email: str,
               hashed_password: str, phone: Optional[str] = None) -> User:
        user = User(
            full_name=full_name,
            email=email,
            hashed_password=hashed_password,
            phone=phone,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def update(self, db: Session, user: User, **kwargs) -> User:
        for key, val in kwargs.items():
            if val is not None:
                setattr(user, key, val)
        db.commit()
        db.refresh(user)
        return user


user_repo = UserRepository()
