"""API v1 — Orders endpoints"""
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.auth_service import get_current_user, get_optional_user
from app.services.order_service import order_service
from app.schemas.order import OrderCreate, OrderDetailResponse, OrderListResponse
from app.models.user import User

router = APIRouter(prefix="/orders", tags=["Orders"])


def _get_session_id(request: Request, response: Response) -> str:
    sid = request.cookies.get("session_id")
    if not sid:
        sid = str(uuid.uuid4())
        response.set_cookie("session_id", sid, max_age=60 * 60 * 24 * 30, httponly=True)
    return sid


@router.post("", response_model=OrderDetailResponse, status_code=201,
             summary="Create order from cart")
def create_order(
    data: OrderCreate,
    request: Request,
    response: Response,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """
    Convert the current cart into an order. Requires shipping details.
    Works for both guests and authenticated users. Cart is cleared after order.
    """
    session_id = _get_session_id(request, response)
    return order_service.create_order(db, data, current_user, session_id)


@router.get("", response_model=OrderListResponse, summary="Get my order history")
def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all orders placed by the authenticated user."""
    return order_service.get_user_orders(db, current_user)


@router.get("/{order_id}", response_model=OrderDetailResponse, summary="Get order by ID")
def get_order(
    order_id: int,
    request: Request,
    response: Response,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Return full order details including all line items."""
    return order_service.get_order(db, order_id, current_user)
