"""API v1 — Products endpoints"""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.product_service import product_service
from app.schemas.product import ProductListResponse, ProductDetailResponse

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=ProductListResponse, summary="List all products")
def list_products(
    category: Optional[str] = Query(None, description="Filter by 'ganesha' or 'household'"),
    subcat: Optional[str] = Query(None, description="Filter by subcategory (Small, Medium, Mugs, Bowls…)"),
    search: Optional[str] = Query(None, description="Full-text search in name and description"),
    badge: Optional[str] = Query(None, description="Filter by badge: eco, new, bestseller, sale"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """
    Return all active products with optional filtering by category, subcategory,
    search term, or badge. Supports pagination via skip/limit.
    """
    return product_service.get_products(db, category, subcat, search, badge, skip, limit)


@router.get("/featured", response_model=ProductListResponse, summary="Get featured products")
def featured_products(
    limit: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db),
):
    """Return bestseller and new products for the homepage carousel."""
    return product_service.get_featured(db, limit)


@router.get("/{product_id}", response_model=ProductDetailResponse, summary="Get product by ID")
def get_product(product_id: str, db: Session = Depends(get_db)):
    """Return full product details including feature tags."""
    return product_service.get_product(db, product_id)
