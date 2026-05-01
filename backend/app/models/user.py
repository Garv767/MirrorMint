import enum

from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class UserRole(str, enum.Enum):
    """Enum for user roles used in RBAC."""
    user = "user"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.user, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    strategies = relationship(
        "Strategy", back_populates="creator", cascade="all, delete-orphan"
    )
