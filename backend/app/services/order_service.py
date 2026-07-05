"""Service — Order business logic"""
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repositories.order_repo import order_repo
from app.repositories.cart_repo import cart_repo
from app.repositories.product_repo import product_repo
from app.schemas.order import OrderCreate, OrderOut, OrderItemOut, OrderListResponse, OrderDetailResponse
from app.models.user import User

SHIPPING_THRESHOLD = 999.0
SHIPPING_FEE = 99.0


class OrderService:

    def create_order(
        self, db: Session,
        data: OrderCreate,
        user: Optional[User],
        session_id: str,
    ) -> OrderDetailResponse:
        # Get cart
        cart = cart_repo.get_or_create(
            db,
            user_id=user.id if user else None,
            session_id=None if user else session_id,
        )
        items = cart_repo.get_items(db, cart.id)
        if not items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot place order with an empty cart"
            )

        # Calculate totals
        subtotal = sum(i.unit_price * i.quantity for i in items)
        shipping_fee = 0.0 if subtotal >= SHIPPING_THRESHOLD else SHIPPING_FEE
        total = subtotal + shipping_fee

        # Create order record
        order = order_repo.create(
            db,
            user_id=user.id if user else None,
            customer_name=data.customer_name,
            customer_email=data.customer_email,
            customer_phone=data.customer_phone,
            shipping_address=data.shipping_address,
            total_amount=total,
            shipping_fee=shipping_fee,
            payment_method=data.payment_method,
            status="confirmed",
        )

        # Create order items
        order_items_out = []
        for item in items:
            p = product_repo.get_by_id(db, item.product_id)
            name = p.name if p else "Unknown"
            order_repo.add_item(
                db, order.id, item.product_id, name,
                item.quantity, item.unit_price
            )
            order_items_out.append(OrderItemOut(
                product_id=item.product_id,
                product_name=name,
                quantity=item.quantity,
                unit_price=item.unit_price,
                line_total=item.unit_price * item.quantity,
            ))

        # Clear cart after order
        cart_repo.clear_cart(db, cart.id)

        order_out = OrderOut(
            id=order.id,
            customer_name=order.customer_name,
            customer_email=order.customer_email,
            customer_phone=order.customer_phone,
            shipping_address=order.shipping_address,
            total_amount=order.total_amount,
            shipping_fee=order.shipping_fee,
            status=order.status,
            payment_method=order.payment_method,
            created_at=order.created_at,
            items=order_items_out,
        )
        return OrderDetailResponse(order=order_out)

    def get_user_orders(self, db: Session, user: User) -> OrderListResponse:
        orders = order_repo.get_user_orders(db, user.id)
        result = []
        for o in orders:
            items = order_repo.get_items(db, o.id)
            items_out = [OrderItemOut(
                product_id=i.product_id, product_name=i.product_name,
                quantity=i.quantity, unit_price=i.unit_price, line_total=i.line_total
            ) for i in items]
            result.append(OrderOut(
                id=o.id, customer_name=o.customer_name,
                customer_email=o.customer_email, customer_phone=o.customer_phone,
                shipping_address=o.shipping_address, total_amount=o.total_amount,
                shipping_fee=o.shipping_fee, status=o.status,
                payment_method=o.payment_method, created_at=o.created_at,
                items=items_out,
            ))
        return OrderListResponse(total=len(result), orders=result)

    def get_order(self, db: Session, order_id: int, user: Optional[User]) -> OrderDetailResponse:
        o = order_repo.get_by_id(db, order_id)
        if not o:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Order not found")
        if user and o.user_id != user.id and not user.is_admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail="Access denied")
        items = order_repo.get_items(db, o.id)
        items_out = [OrderItemOut(
            product_id=i.product_id, product_name=i.product_name,
            quantity=i.quantity, unit_price=i.unit_price, line_total=i.line_total
        ) for i in items]
        return OrderDetailResponse(order=OrderOut(
            id=o.id, customer_name=o.customer_name,
            customer_email=o.customer_email, customer_phone=o.customer_phone,
            shipping_address=o.shipping_address, total_amount=o.total_amount,
            shipping_fee=o.shipping_fee, status=o.status,
            payment_method=o.payment_method, created_at=o.created_at,
            items=items_out,
        ))


order_service = OrderService()
