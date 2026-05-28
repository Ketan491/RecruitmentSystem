"""
User models — Pydantic schemas for request/response shaping.
Password is never included in response models.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime

ALLOWED_ROLES = {"user", "hr"}


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(default="user")

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        v = v.lower().strip()
        if v not in ALLOWED_ROLES:
            raise ValueError(f"role must be one of: {', '.join(ALLOWED_ROLES)}")
        return v

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        return v.strip()


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    avatar: str | None = None
    created_at: datetime
    skills: list[str] = []
    resume_uploaded: bool = False


class UserUpdate(BaseModel):
    """All fields optional — only provided ones get updated."""
    name: str | None = Field(default=None, min_length=2, max_length=100)
    avatar: str | None = None
    skills: list[str | None] = None
    phone: str | None = None
    location: str | None = None
    bio: str | None = None
    linkedin: str | None = None
    github: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
