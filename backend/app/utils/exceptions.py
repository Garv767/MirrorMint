from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


def create_error_response(code: int, message: str, details=None) -> dict:
    """Build a standardised error envelope."""
    response = {
        "error": {
            "code": code,
            "message": message,
        }
    }
    if details is not None:
        response["error"]["details"] = details
    return response


async def http_exception_handler(
    request: Request, exc: HTTPException
) -> JSONResponse:
    """Handle FastAPI HTTPException with a consistent JSON envelope."""
    return JSONResponse(
        status_code=exc.status_code,
        content=create_error_response(exc.status_code, exc.detail),
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Handle Pydantic validation errors with field-level detail."""
    errors = []
    for error in exc.errors():
        field = " → ".join(str(loc) for loc in error["loc"])
        errors.append({"field": field, "message": error["msg"]})
    return JSONResponse(
        status_code=422,
        content=create_error_response(422, "Validation failed.", errors),
    )


async def generic_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    """Catch-all handler for unhandled server errors."""
    return JSONResponse(
        status_code=500,
        content=create_error_response(500, "An unexpected error occurred."),
    )
