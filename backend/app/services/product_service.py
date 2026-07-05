"""Service — Product business logic"""
from typing import Optional, List
from sqlalchemy.orm import Session

from app.repositories.product_repo import product_repo
from app.schemas.product import ProductBase, ProductDetail, ProductListResponse, ProductDetailResponse
from fastapi import HTTPException, status


class ProductService:

    def get_products(
        self, db: Session,
        category: Optional[str] = None,
        subcat: Optional[str] = None,
        search: Optional[str] = None,
        badge: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> ProductListResponse:
        products = product_repo.get_all(db, category, subcat, search, badge, skip, limit)
        total = product_repo.count(db, category)
        items = [ProductBase(
            id=p.id, name=p.name, category=p.category, subcat=p.subcat,
            price=p.price, original_price=p.original_price,
            rating=p.rating, reviews=p.reviews, badge=p.badge,
            image=p.image, emoji=p.emoji,
            description=p.description, stock=p.stock
        ) for p in products]
        return ProductListResponse(total=total, products=items)

    def get_product(self, db: Session, product_id: str) -> ProductDetailResponse:
        p = product_repo.get_by_id(db, product_id)
        if not p:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Product '{product_id}' not found")
        return ProductDetailResponse(product=ProductDetail.from_orm_with_features(p))

    def get_featured(self, db: Session, limit: int = 8) -> ProductListResponse:
        products = product_repo.get_featured(db, limit)
        items = [ProductBase(
            id=p.id, name=p.name, category=p.category, subcat=p.subcat,
            price=p.price, original_price=p.original_price,
            rating=p.rating, reviews=p.reviews, badge=p.badge,
            image=p.image, emoji=p.emoji,
            description=p.description, stock=p.stock
        ) for p in products]
        return ProductListResponse(total=len(items), products=items)


product_service = ProductService()
