"""Pydantic schemas — Cart"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class CartItemAdd(BaseModel):
    product_id: str
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemOut(BaseModel):
    id: int
    product_id: str
    product_name: str
    product_image: Optional[str] = None
    product_emoji: str = "🏺"
    quantity: int
    unit_price: float
    line_total: float

    model_config = {"from_attributes": True}


class CartOut(BaseModel):
    success: bool = True
    cart_id: int
    items: List[CartItemOut]
    subtotal: float
    shipping_fee: float
    total: float
    item_count: int
