"""Repository — Admin DB queries"""
from typing import Optional
from sqlalchemy.orm import Session
from app.models.admin import Admin


class AdminRepository:

    def get_by_email(self, db: Session, email: str) -> Optional[Admin]:
        return db.query(Admin).filter(Admin.email == email).first()

    def get_by_id(self, db: Session, admin_id: int) -> Optional[Admin]:
        return db.query(Admin).filter(Admin.id == admin_id).first()

    def create(self, db: Session, full_name: str, email: str,
               hashed_password: str) -> Admin:
        admin = Admin(
            full_name=full_name,
            email=email,
            hashed_password=hashed_password,
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        return admin


admin_repo = AdminRepository()
