"""Pydantic schemas — Admin & Dashboard"""
from pydantic import BaseModel
from typing import Optional, List


class LowStockProduct(BaseModel):
    id: str
    name: str
    stock: int
    emoji: str


class BestsellerProduct(BaseModel):
    id: str
    name: str
    quantity_sold: int
    revenue: float
    image: Optional[str] = None
    emoji: str = "🏺"


class SalesTrend(BaseModel):
    date: str
    sales: float
    orders_count: int


class DashboardStats(BaseModel):
    total_revenue: float
    total_orders: int
    average_order_value: float
    total_products: int
    total_users: int
    low_stock_products: List[LowStockProduct]
    bestsellers: List[BestsellerProduct]
    slow_movers: List[BestsellerProduct]
    sales_trend: List[SalesTrend]


class AdminProductCreate(BaseModel):
    id: str
    name: str
    category: str
    subcat: str
    price: float
    original_price: Optional[float] = None
    rating: float = 4.5
    reviews: int = 0
    badge: Optional[str] = None
    image: Optional[str] = None
    emoji: str = "🏺"
    description: Optional[str] = None
    features: Optional[str] = ""  # Comma-separated
    stock: int = 100


class AdminProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    subcat: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    rating: Optional[float] = None
    reviews: Optional[int] = None
    badge: Optional[str] = None
    image: Optional[str] = None
    emoji: Optional[str] = None
    description: Optional[str] = None
    features: Optional[str] = None  # Comma-separated
    stock: Optional[int] = None
    is_active: Optional[bool] = None
