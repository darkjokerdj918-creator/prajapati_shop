"""Service — Cart business logic"""
import uuid
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Request

from app.repositories.cart_repo import cart_repo
from app.repositories.product_repo import product_repo
from app.schemas.cart import CartOut, CartItemOut, CartItemAdd, CartItemUpdate
from app.models.user import User

SHIPPING_THRESHOLD = 999.0
SHIPPING_FEE = 99.0


def _session_id(request: Request) -> str:
    """Derive a guest session ID from a cookie or generate one."""
    sid = request.cookies.get("session_id")
    return sid or str(uuid.uuid4())


class CartService:

    def _build_cart_out(self, db: Session, cart_id: int) -> CartOut:
        items = cart_repo.get_items(db, cart_id)
        cart_items = []
        subtotal = 0.0
        for item in items:
            p = product_repo.get_by_id(db, item.product_id)
            name = p.name if p else "Unknown Product"
            image = p.image if p else None
            emoji = p.emoji if p else "🏺"
            line_total = item.unit_price * item.quantity
            subtotal += line_total
            cart_items.append(CartItemOut(
                id=item.id,
                product_id=item.product_id,
                product_name=name,
                product_image=image,
                product_emoji=emoji,
                quantity=item.quantity,
                unit_price=item.unit_price,
                line_total=line_total,
            ))
        shipping_fee = 0.0 if subtotal >= SHIPPING_THRESHOLD else SHIPPING_FEE
        return CartOut(
            cart_id=cart_id,
            items=cart_items,
            subtotal=subtotal,
            shipping_fee=shipping_fee,
            total=subtotal + shipping_fee,
            item_count=sum(i.quantity for i in items),
        )

    def get_cart(self, db: Session, user: Optional[User], session_id: str) -> CartOut:
        cart = cart_repo.get_or_create(
            db,
            user_id=user.id if user else None,
            session_id=None if user else session_id,
        )
        return self._build_cart_out(db, cart.id)

    def add_item(self, db: Session, user: Optional[User], session_id: str, data: CartItemAdd) -> CartOut:
        product = product_repo.get_by_id(db, data.product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Product not found")
        if data.quantity < 1:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Quantity must be at least 1")
        cart = cart_repo.get_or_create(
            db,
            user_id=user.id if user else None,
            session_id=None if user else session_id,
        )
        cart_repo.add_item(db, cart.id, data.product_id, data.quantity, product.price)
        return self._build_cart_out(db, cart.id)

    def update_item(self, db: Session, user: Optional[User], session_id: str,
                    item_id: int, data: CartItemUpdate) -> CartOut:
        item = cart_repo.get_item_by_id(db, item_id)
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Cart item not found")
        if data.quantity < 1:
            cart_repo.remove_item(db, item)
        else:
            cart_repo.update_item(db, item, data.quantity)
        return self._build_cart_out(db, item.cart_id)

    def remove_item(self, db: Session, user: Optional[User], session_id: str,
                    item_id: int) -> CartOut:
        item = cart_repo.get_item_by_id(db, item_id)
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Cart item not found")
        cart_id = item.cart_id
        cart_repo.remove_item(db, item)
        return self._build_cart_out(db, cart_id)

    def clear_cart(self, db: Session, user: Optional[User], session_id: str) -> CartOut:
        cart = cart_repo.get_or_create(
            db,
            user_id=user.id if user else None,
            session_id=None if user else session_id,
        )
        cart_repo.clear_cart(db, cart.id)
        return self._build_cart_out(db, cart.id)


cart_service = CartService()
