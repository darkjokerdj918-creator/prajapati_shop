"""Repository — Product DB queries"""
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.product import Product


class ProductRepository:

    def get_all(
        self,
        db: Session,
        category: Optional[str] = None,
        subcat: Optional[str] = None,
        search: Optional[str] = None,
        badge: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Product]:
        q = db.query(Product).filter(Product.is_active == True)
        if category:
            q = q.filter(Product.category == category)
        if subcat:
            q = q.filter(Product.subcat == subcat)
        if badge:
            q = q.filter(Product.badge == badge)
        if search:
            term = f"%{search.lower()}%"
            q = q.filter(
                Product.name.ilike(term) | Product.description.ilike(term)
            )
        return q.offset(skip).limit(limit).all()

    def get_by_id(self, db: Session, product_id: str) -> Optional[Product]:
        return db.query(Product).filter(
            Product.id == product_id, Product.is_active == True
        ).first()

    def get_featured(self, db: Session, limit: int = 8) -> List[Product]:
        return db.query(Product).filter(
            Product.is_active == True,
            Product.badge.in_(["bestseller", "new"])
        ).limit(limit).all()

    def count(self, db: Session, category: Optional[str] = None) -> int:
        q = db.query(Product).filter(Product.is_active == True)
        if category:
            q = q.filter(Product.category == category)
        return q.count()


product_repo = ProductRepository()
