from fastapi import APIRouter

from ...config import get_settings
from ...metrics import METRIC_CATALOG

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check() -> dict[str, str | bool | int]:
    settings = get_settings()
    return {
        "status": "ok",
        "app_name": settings.app_name,
        "environment": settings.app_env,
        "database_configured": bool(settings.database_url),
        "openai_configured": bool(settings.openai_api_key),
        "metric_count": len(METRIC_CATALOG),
    }
