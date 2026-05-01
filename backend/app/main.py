from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
import time

from app.database import engine, Base
from app.models import User, Strategy  # noqa: F401 — register models with Base
from app.api.v1.router import api_v1_router
from app.utils.exceptions import (
    http_exception_handler,
    validation_exception_handler,
    generic_exception_handler,
)
from app.config import settings
from app.core.security import hash_password
from app.database import SessionLocal
from app.models.user import UserRole

# ---------------------------------------------------------------------------
# Create all tables on startup (no Alembic for speed; production should migrate)
# ---------------------------------------------------------------------------
Base.metadata.create_all(bind=engine)

def seed_admin():
    """Create initial admin user if it doesn't exist."""
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.role == UserRole.admin).first()
        if not admin:
            print(f"Seeding admin user: {settings.INITIAL_ADMIN_EMAIL}")
            admin_user = User(
                email=settings.INITIAL_ADMIN_EMAIL,
                hashed_password=hash_password(settings.INITIAL_ADMIN_PASSWORD),
                role=UserRole.admin
            )
            db.add(admin_user)
            db.commit()
    finally:
        db.close()

seed_admin()

START_TIME = time.time()

# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="MirrorMint API",
    description="Trading Strategy Management Platform — REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS — allow the Next.js frontend during development
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Exception handlers (standardised JSON error envelope)
# ---------------------------------------------------------------------------
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# ---------------------------------------------------------------------------
# Versioned router
# ---------------------------------------------------------------------------
app.include_router(api_v1_router)


@app.get("/", tags=["Health"])
def health_check():
    """Root health-check endpoint."""
    uptime_seconds = int(time.time() - START_TIME)
    return {
        "status": "healthy",
        "service": "MirrorMint API",
        "version": "1.0.0",
        "uptime": f"{uptime_seconds}s"
    }
