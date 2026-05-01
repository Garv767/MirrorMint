from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    user = "user"
    admin = "admin"


class UserCreate(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str = Field(
        ..., min_length=6, max_length=128,
        description="Password must be 6–128 characters.",
    )


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str = Field(..., min_length=1)


class UserResponse(BaseModel):
    """Public user representation returned by the API."""
    id: int
    email: str
    role: UserRole
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    """JWT token response with embedded user info."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
