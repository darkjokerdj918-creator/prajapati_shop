"""Repository — Cart and CartItem DB queries"""
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.cart import Cart, CartItem


class CartRepository:

    def get_or_create(
        self, db: Session,
        user_id: Optional[int] = None,
        session_id: Optional[str] = None
    ) -> Cart:
        q = db.query(Cart)
        if user_id:
            cart = q.filter(Cart.user_id == user_id).first()
        else:
            cart = q.filter(Cart.session_id == session_id).first()

        if not cart:
            cart = Cart(user_id=user_id, session_id=session_id)
            db.add(cart)
            db.commit()
            db.refresh(cart)
        return cart

    def get_items(self, db: Session, cart_id: int) -> List[CartItem]:
        return db.query(CartItem).filter(CartItem.cart_id == cart_id).all()

    def get_item(self, db: Session, cart_id: int, product_id: str) -> Optional[CartItem]:
        return db.query(CartItem).filter(
            CartItem.cart_id == cart_id,
            CartItem.product_id == product_id
        ).first()

    def get_item_by_id(self, db: Session, item_id: int) -> Optional[CartItem]:
        return db.query(CartItem).filter(CartItem.id == item_id).first()

    def add_item(self, db: Session, cart_id: int, product_id: str,
                 quantity: int, unit_price: float) -> CartItem:
        existing = self.get_item(db, cart_id, product_id)
        if existing:
            existing.quantity += quantity
            db.commit()
            db.refresh(existing)
            return existing
        item = CartItem(
            cart_id=cart_id, product_id=product_id,
            quantity=quantity, unit_price=unit_price
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    def update_item(self, db: Session, item: CartItem, quantity: int) -> CartItem:
        item.quantity = quantity
        db.commit()
        db.refresh(item)
        return item

    def remove_item(self, db: Session, item: CartItem) -> None:
        db.delete(item)
        db.commit()

    def clear_cart(self, db: Session, cart_id: int) -> None:
        db.query(CartItem).filter(CartItem.cart_id == cart_id).delete()
        db.commit()


cart_repo = CartRepository()
