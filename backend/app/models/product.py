"""SQLAlchemy ORM model — Product"""
from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False, index=True)   # ganesha | household
    subcat = Column(String(50), nullable=False, index=True)      # Small | Medium | Mugs | Bowls…
    price = Column(Float, nullable=True)
    original_price = Column(Float, nullable=True)
    rating = Column(Float, default=4.5)
    reviews = Column(Integer, default=0)
    badge = Column(String(30), nullable=True)                    # eco | new | bestseller | sale
    image = Column(String(300), nullable=True)
    emoji = Column(String(10), default="🏺")
    description = Column(Text, nullable=True)
    features = Column(Text, nullable=True)                       # Comma-separated list
    stock = Column(Integer, default=100)
    is_active = Column(Boolean, default=True)
