"""API v1 — Administrative & Dashboard endpoints"""
import os
import shutil
import uuid
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.auth_service import get_current_user, bearer_scheme
from app.models.user import User
from app.models.admin import Admin
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.schemas.admin import (
    DashboardStats, LowStockProduct, BestsellerProduct, SalesTrend,
    AdminProductCreate, AdminProductUpdate
)
from app.schemas.product import ProductDetailResponse, ProductDetail
from app.schemas.user import UserLogin, TokenResponse, UserOut
from app.repositories.user_repo import user_repo
from app.core.security import verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/admin", tags=["Admin Operations"])


@router.post("/login", response_model=TokenResponse, summary="Admin Login")
def admin_login(data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate admin credentials and return access token."""
    from app.repositories.admin_repo import admin_repo
    admin_user = admin_repo.get_by_email(db, data.email)
    if not admin_user or not verify_password(data.password, admin_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not admin_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive. Contact support."
        )
    
    token = create_access_token({"sub": str(admin_user.id), "email": admin_user.email})
    
    user_out = UserOut(
        id=admin_user.id,
        full_name=admin_user.full_name,
        email=admin_user.email,
        phone=None,
        address=None,
        is_admin=True,
        created_at=admin_user.created_at
    )
    return TokenResponse(
        access_token=token,
        user=user_out
    )


def get_current_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Admin:
    """Dependency to look up and authorize the current administrator."""
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
    
    from app.repositories.admin_repo import admin_repo
    admin = admin_repo.get_by_id(db, int(payload["sub"]))
    if not admin or not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required."
        )
    return admin


# Resolve frontend static directory path
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "frontend"))
if not os.path.isdir(FRONTEND_DIR):
    if os.path.isdir("/frontend"):
        FRONTEND_DIR = "/frontend"


@router.get("/dashboard/stats", response_model=DashboardStats, summary="Get store performance stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Retrieve e-commerce metrics: total revenue, order details, sales trends, and stock limits."""
    # 1. Total revenue (excluding cancelled)
    total_revenue = db.query(func.sum(Order.total_amount)).filter(Order.status != "cancelled").scalar() or 0.0
    
    # 2. Total orders (excluding cancelled)
    total_orders = db.query(func.count(Order.id)).filter(Order.status != "cancelled").scalar() or 0
    
    # 3. Average order value
    avg_order_value = total_revenue / total_orders if total_orders > 0 else 0.0
    
    # 4. Total active products
    total_products = db.query(func.count(Product.id)).filter(Product.is_active == True).scalar() or 0
    
    # 5. Total users
    total_users = db.query(func.count(User.id)).scalar() or 0
    
    # 6. Low stock products (stock < 10)
    low_stock = db.query(Product).filter(Product.is_active == True, Product.stock < 10).all()
    low_stock_list = [
        LowStockProduct(id=p.id, name=p.name, stock=p.stock, emoji=p.emoji)
        for p in low_stock
    ]
    
    # 7. Bestsellers: top 5 products by quantity sold
    bestseller_query = (
        db.query(
            OrderItem.product_id,
            OrderItem.product_name,
            func.sum(OrderItem.quantity).label("qty"),
            func.sum(OrderItem.line_total).label("rev")
        )
        .join(Order, OrderItem.order_id == Order.id)
        .filter(Order.status != "cancelled")
        .group_by(OrderItem.product_id, OrderItem.product_name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
        .all()
    )
    
    bestsellers_list = []
    for row in bestseller_query:
        prod = db.query(Product).filter(Product.id == row.product_id).first()
        bestsellers_list.append(
            BestsellerProduct(
                id=row.product_id,
                name=row.product_name,
                quantity_sold=row.qty,
                revenue=row.rev,
                image=prod.image if prod else None,
                emoji=prod.emoji if prod else "🏺"
            )
        )
        
    # 8. Slow movers: bottom 5 products by quantity sold
    all_active_products = db.query(Product).filter(Product.is_active == True).all()
    sales_qty = {}
    sales_rev = {}
    for item in (
        db.query(OrderItem.product_id, func.sum(OrderItem.quantity), func.sum(OrderItem.line_total))
        .join(Order, OrderItem.order_id == Order.id)
        .filter(Order.status != "cancelled")
        .group_by(OrderItem.product_id)
        .all()
    ):
        sales_qty[item[0]] = item[1]
        sales_rev[item[0]] = item[2]
        
    product_sales = []
    for p in all_active_products:
        qty = sales_qty.get(p.id, 0)
        rev = sales_rev.get(p.id, 0.0)
        product_sales.append((p, qty, rev))
        
    product_sales.sort(key=lambda x: x[1])
    
    slow_movers_list = [
        BestsellerProduct(
            id=p.id,
            name=p.name,
            quantity_sold=qty,
            revenue=rev,
            image=p.image,
            emoji=p.emoji
        )
        for p, qty, rev in product_sales[:5]
    ]
    
    # 9. Sales trend (last 7 days)
    today = datetime.now(timezone.utc).date()
    trend_dict = {}
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        trend_dict[d.strftime('%Y-%m-%d')] = {"sales": 0.0, "orders_count": 0}
        
    start_date = datetime.now(timezone.utc) - timedelta(days=8)
    orders_last_week = (
        db.query(Order)
        .filter(Order.status != "cancelled", Order.created_at >= start_date)
        .all()
    )
    
    for order in orders_last_week:
        created_date = order.created_at
        if created_date.tzinfo is None:
            created_date = created_date.replace(tzinfo=timezone.utc)
        date_str = created_date.strftime('%Y-%m-%d')
        if date_str in trend_dict:
            trend_dict[date_str]["sales"] += order.total_amount
            trend_dict[date_str]["orders_count"] += 1
            
    sales_trend_list = [
        SalesTrend(date=dt, sales=val["sales"], orders_count=val["orders_count"])
        for dt, val in sorted(trend_dict.items())
    ]
    
    return DashboardStats(
        total_revenue=total_revenue,
        total_orders=total_orders,
        average_order_value=avg_order_value,
        total_products=total_products,
        total_users=total_users,
        low_stock_products=low_stock_list,
        bestsellers=bestsellers_list,
        slow_movers=slow_movers_list,
        sales_trend=sales_trend_list
    )


@router.get("/products", response_model=List[ProductDetail], summary="List all products for admin")
def list_products_admin(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Retrieve all products from the database, including inactive (deleted) products."""
    products = db.query(Product).order_by(Product.id).all()
    return [ProductDetail.from_orm_with_features(p) for p in products]


@router.post("/products", response_model=ProductDetailResponse, summary="Create a new product")
def create_product(
    data: AdminProductCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Create a new product row or reactivate an inactive one if matching ID exists."""
    existing = db.query(Product).filter(Product.id == data.id).first()
    if existing:
        if not existing.is_active:
            for key, val in data.model_dump().items():
                setattr(existing, key, val)
            existing.is_active = True
            db.commit()
            db.refresh(existing)
            return ProductDetailResponse(product=ProductDetail.from_orm_with_features(existing))
        else:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Product with ID '{data.id}' already exists."
            )
            
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return ProductDetailResponse(product=ProductDetail.from_orm_with_features(product))


@router.put("/products/{product_id}", response_model=ProductDetailResponse, summary="Update an existing product")
def update_product(
    product_id: str,
    data: AdminProductUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Update editable fields of a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{product_id}' not found."
        )
        
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(product, key, val)
        
    db.commit()
    db.refresh(product)
    return ProductDetailResponse(product=ProductDetail.from_orm_with_features(product))


@router.delete("/products/{product_id}", summary="Delete a product")
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Perform a soft delete of a product by marking is_active = False."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{product_id}' not found."
        )
    
    product.is_active = False
    db.commit()
    return {"success": True, "message": f"Product '{product_id}' soft-deleted successfully."}


@router.post("/products/upload-image", summary="Upload product image file")
async def upload_image(
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin),
):
    """Upload a file to frontend/images/uploaded/ and return its path."""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp", ".svg"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPG, JPEG, PNG, WEBP, and SVG are allowed."
        )
        
    images_dir = os.path.join(FRONTEND_DIR, "images", "uploaded")
    os.makedirs(images_dir, exist_ok=True)
    
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(images_dir, unique_filename)
    
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"success": True, "image_path": f"images/uploaded/{unique_filename}"}
