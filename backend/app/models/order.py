"""SQLAlchemy ORM models — Order and OrderItem"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    customer_name = Column(String(150), nullable=False)
    customer_email = Column(String(200), nullable=False)
    customer_phone = Column(String(20), nullable=True)
    shipping_address = Column(Text, nullable=False)
    total_amount = Column(Float, nullable=False)
    shipping_fee = Column(Float, default=0.0)
    status = Column(String(30), default="pending")  # pending | confirmed | shipped | delivered | cancelled
    payment_method = Column(String(30), default="cod")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    product_name = Column(String(200), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    line_total = Column(Float, nullable=False)
