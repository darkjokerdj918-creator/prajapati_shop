"""Pydantic schemas — Product"""
from pydantic import BaseModel
from typing import Optional, List


class ProductBase(BaseModel):
    id: str
    name: str
    category: str
    subcat: str
    price: Optional[float] = None
    original_price: Optional[float] = None
    rating: Optional[float] = None
    reviews: int = 0
    badge: Optional[str] = None
    image: Optional[str] = None
    emoji: str = "🏺"
    description: Optional[str] = None
    stock: int = 100


class ProductDetail(ProductBase):
    features: Optional[List[str]] = []

    @classmethod
    def from_orm_with_features(cls, obj) -> "ProductDetail":
        feats = obj.features.split(",") if obj.features else []
        return cls(
            id=obj.id, name=obj.name, category=obj.category,
            subcat=obj.subcat, price=obj.price, original_price=obj.original_price,
            rating=obj.rating, reviews=obj.reviews, badge=obj.badge,
            image=obj.image, emoji=obj.emoji, description=obj.description,
            stock=obj.stock, features=[f.strip() for f in feats]
        )


class ProductListResponse(BaseModel):
    success: bool = True
    total: int
    products: List[ProductBase]


class ProductDetailResponse(BaseModel):
    success: bool = True
    product: ProductDetail
