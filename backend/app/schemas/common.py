"""Pydantic schemas — shared / common responses"""
from pydantic import BaseModel
from typing import Optional, Any


class SuccessResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[Any] = None


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    detail: Optional[str] = None
