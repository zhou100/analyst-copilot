from fastapi import APIRouter

from ...metrics import METRIC_CATALOG

router = APIRouter(tags=["metrics"])


@router.get("/metrics")
def list_metrics() -> dict[str, int | list[dict[str, str | list[str]]]]:
    return {
        "count": len(METRIC_CATALOG),
        "metrics": [metric.model_dump() for metric in METRIC_CATALOG],
    }
