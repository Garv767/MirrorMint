from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Strategy(Base):
    __tablename__ = "strategies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    bot_type = Column(String(50), nullable=False)
    risk_level = Column(String(20), nullable=False)
    target_roi = Column(Float, nullable=False)
    created_by = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    creator = relationship("User", back_populates="strategies")
