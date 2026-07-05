"""API v1 — Newsletter and Contact endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.core.database import get_db
from app.models.newsletter import NewsletterSubscriber, ContactMessage
from app.schemas.common import SuccessResponse

newsletter_router = APIRouter(prefix="/newsletter", tags=["Newsletter"])
contact_router = APIRouter(prefix="/contact", tags=["Contact"])


class SubscribeRequest(BaseModel):
    email: EmailStr


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = "General Enquiry"
    message: str


@newsletter_router.post("/subscribe", response_model=SuccessResponse,
                        summary="Subscribe to newsletter")
def subscribe(data: SubscribeRequest, db: Session = Depends(get_db)):
    """Subscribe an email to the Prajapati Store newsletter."""
    existing = db.query(NewsletterSubscriber).filter(
        NewsletterSubscriber.email == data.email
    ).first()
    if existing:
        if existing.is_active:
            return SuccessResponse(message="You are already subscribed! 🎉")
        existing.is_active = True
        db.commit()
        return SuccessResponse(message="Welcome back! You've been re-subscribed. 🌿")

    subscriber = NewsletterSubscriber(email=data.email)
    db.add(subscriber)
    db.commit()
    return SuccessResponse(message="Thank you for subscribing! 🎉 Expect amazing deals soon.")


@newsletter_router.delete("/unsubscribe", response_model=SuccessResponse,
                          summary="Unsubscribe from newsletter")
def unsubscribe(data: SubscribeRequest, db: Session = Depends(get_db)):
    sub = db.query(NewsletterSubscriber).filter(
        NewsletterSubscriber.email == data.email
    ).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Email not found in subscriber list")
    sub.is_active = False
    db.commit()
    return SuccessResponse(message="You've been unsubscribed successfully.")


@contact_router.post("", response_model=SuccessResponse, summary="Send contact message")
def send_contact(data: ContactRequest, db: Session = Depends(get_db)):
    """Store a contact/enquiry message from the website contact form."""
    msg = ContactMessage(
        name=data.name,
        email=data.email,
        subject=data.subject,
        message=data.message,
    )
    db.add(msg)
    db.commit()
    return SuccessResponse(
        message="Thank you for reaching out! We'll get back to you within 24 hours. 🙏"
    )
