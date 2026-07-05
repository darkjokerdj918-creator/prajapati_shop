"""Repository — Order and OrderItem DB queries"""
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.order import Order, OrderItem


class OrderRepository:

    def create(self, db: Session, **kwargs) -> Order:
        order = Order(**kwargs)
        db.add(order)
        db.commit()
        db.refresh(order)
        return order

    def add_item(self, db: Session, order_id: int, product_id: str,
                 product_name: str, quantity: int,
                 unit_price: float) -> OrderItem:
        item = OrderItem(
            order_id=order_id, product_id=product_id,
            product_name=product_name, quantity=quantity,
            unit_price=unit_price, line_total=unit_price * quantity
        )
        db.add(item)
        db.commit()
        return item

    def get_by_id(self, db: Session, order_id: int) -> Optional[Order]:
        return db.query(Order).filter(Order.id == order_id).first()

    def get_items(self, db: Session, order_id: int) -> List[OrderItem]:
        return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()

    def get_user_orders(self, db: Session, user_id: int) -> List[Order]:
        return db.query(Order).filter(
            Order.user_id == user_id
        ).order_by(Order.created_at.desc()).all()

    def get_all(self, db: Session, skip: int = 0, limit: int = 50) -> List[Order]:
        return db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()


order_repo = OrderRepository()
