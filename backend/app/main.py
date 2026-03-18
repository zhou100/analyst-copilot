from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.router import api_router
from .config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="Trust-first analyst copilot API for semantic metrics and SQL generation.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "Analyst Copilot API is running.",
        "docs_url": "/docs",
    }
