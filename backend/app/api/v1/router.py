"""API v1 — main router that collects all endpoint sub-routers"""
from fastapi import APIRouter
from app.api.v1.endpoints.products import router as products_router
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.cart import router as cart_router
from app.api.v1.endpoints.orders import router as orders_router
from app.api.v1.endpoints.newsletter import newsletter_router, contact_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(products_router)
api_router.include_router(auth_router)
api_router.include_router(cart_router)
api_router.include_router(orders_router)
api_router.include_router(newsletter_router)
api_router.include_router(contact_router)
