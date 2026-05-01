from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.strategy import Strategy
from app.models.user import User
from app.schemas.strategy import StrategyCreate, StrategyUpdate, StrategyResponse
from app.core.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/strategies", tags=["Strategies"])


def _to_response(strategy: Strategy) -> StrategyResponse:
    """Convert a Strategy ORM instance to a response schema,
    enriching it with the creator's email."""
    return StrategyResponse(
        id=strategy.id,
        title=strategy.title,
        bot_type=strategy.bot_type,
        risk_level=strategy.risk_level,
        target_roi=strategy.target_roi,
        created_by=strategy.created_by,
        creator_email=strategy.creator.email if strategy.creator else None,
        created_at=strategy.created_at,
        updated_at=strategy.updated_at,
    )


@router.get(
    "",
    response_model=List[StrategyResponse],
    summary="List all strategies",
)
def list_strategies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all strategies, ordered by creation date (newest first)."""
    strategies = (
        db.query(Strategy).order_by(Strategy.created_at.desc()).all()
    )
    return [_to_response(s) for s in strategies]


@router.get(
    "/{strategy_id}",
    response_model=StrategyResponse,
    summary="Get a strategy by ID",
)
def get_strategy(
    strategy_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return a single strategy by its ID."""
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    if not strategy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Strategy not found.",
        )
    return _to_response(strategy)


@router.post(
    "",
    response_model=StrategyResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new strategy (Admin only)",
)
def create_strategy(
    data: StrategyCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Create a new trading strategy. Requires admin role."""
    strategy = Strategy(
        title=data.title,
        bot_type=data.bot_type.value,
        risk_level=data.risk_level.value,
        target_roi=data.target_roi,
        created_by=admin.id,
    )
    db.add(strategy)
    db.commit()
    db.refresh(strategy)
    return _to_response(strategy)


@router.put(
    "/{strategy_id}",
    response_model=StrategyResponse,
    summary="Update a strategy (Admin only)",
)
def update_strategy(
    strategy_id: int,
    data: StrategyUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Update an existing strategy. Requires admin role."""
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    if not strategy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Strategy not found.",
        )

    update_fields = data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        # Convert enum instances to their string value
        if hasattr(value, "value"):
            value = value.value
        setattr(strategy, field, value)

    db.commit()
    db.refresh(strategy)
    return _to_response(strategy)


@router.delete(
    "/{strategy_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a strategy (Admin only)",
)
def delete_strategy(
    strategy_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Delete a strategy by ID. Requires admin role."""
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    if not strategy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Strategy not found.",
        )
    db.delete(strategy)
    db.commit()
