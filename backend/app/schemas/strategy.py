from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum


class BotType(str, Enum):
    arbitrage = "Arbitrage"
    trend = "Trend"
    mean_reversion = "Mean Reversion"
    scalping = "Scalping"


class RiskLevel(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"


class StrategyCreate(BaseModel):
    """Schema for creating a new strategy (admin only)."""
    title: str = Field(
        ..., min_length=1, max_length=255, description="Strategy name."
    )
    bot_type: BotType
    risk_level: RiskLevel
    target_roi: float = Field(
        ..., gt=0, le=1000, description="Target ROI percentage."
    )


class StrategyUpdate(BaseModel):
    """Schema for partial strategy updates (admin only)."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    bot_type: Optional[BotType] = None
    risk_level: Optional[RiskLevel] = None
    target_roi: Optional[float] = Field(None, gt=0, le=1000)


class StrategyResponse(BaseModel):
    """Public strategy representation returned by the API."""
    id: int
    title: str
    bot_type: str
    risk_level: str
    target_roi: float
    created_by: int
    creator_email: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
