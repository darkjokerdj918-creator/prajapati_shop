"""API v1 — Cart endpoints"""
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.auth_service import get_optional_user
from app.services.cart_service import cart_service
from app.schemas.cart import CartOut, CartItemAdd, CartItemUpdate
from app.models.user import User

router = APIRouter(prefix="/cart", tags=["Cart"])


def _get_session_id(request: Request, response: Response) -> str:
    sid = request.cookies.get("session_id")
    if not sid:
        sid = str(uuid.uuid4())
        response.set_cookie("session_id", sid, max_age=60 * 60 * 24 * 30, httponly=True)
    return sid


@router.get("", response_model=CartOut, summary="Get current cart")
def get_cart(
    request: Request,
    response: Response,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Return cart items with subtotal, shipping, and total. Works for guests and logged-in users."""
    session_id = _get_session_id(request, response)
    return cart_service.get_cart(db, current_user, session_id)


@router.post("/add", response_model=CartOut, status_code=201, summary="Add item to cart")
def add_to_cart(
    data: CartItemAdd,
    request: Request,
    response: Response,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Add a product to cart by product_id and quantity. Merges if already in cart."""
    session_id = _get_session_id(request, response)
    return cart_service.add_item(db, current_user, session_id, data)


@router.put("/update/{item_id}", response_model=CartOut, summary="Update cart item quantity")
def update_cart_item(
    item_id: int,
    data: CartItemUpdate,
    request: Request,
    response: Response,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Update the quantity of a specific cart item. Set to 0 to remove."""
    session_id = _get_session_id(request, response)
    return cart_service.update_item(db, current_user, session_id, item_id, data)


@router.delete("/remove/{item_id}", response_model=CartOut, summary="Remove item from cart")
def remove_cart_item(
    item_id: int,
    request: Request,
    response: Response,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Remove a specific item from the cart by its cart item ID."""
    session_id = _get_session_id(request, response)
    return cart_service.remove_item(db, current_user, session_id, item_id)


@router.delete("/clear", response_model=CartOut, summary="Clear all cart items")
def clear_cart(
    request: Request,
    response: Response,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Remove all items from the current cart."""
    session_id = _get_session_id(request, response)
    return cart_service.clear_cart(db, current_user, session_id)
