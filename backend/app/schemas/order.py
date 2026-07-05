"""Pydantic schemas — Order"""
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class OrderItemOut(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    unit_price: float
    line_total: float

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: Optional[str] = None
    shipping_address: str
    payment_method: str = "cod"


class OrderOut(BaseModel):
    id: int
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    shipping_address: str
    total_amount: float
    shipping_fee: float
    status: str
    payment_method: str
    created_at: datetime
    items: List[OrderItemOut] = []

    model_config = {"from_attributes": True}


class OrderListResponse(BaseModel):
    success: bool = True
    total: int
    orders: List[OrderOut]


class OrderDetailResponse(BaseModel):
    success: bool = True
    order: OrderOut
