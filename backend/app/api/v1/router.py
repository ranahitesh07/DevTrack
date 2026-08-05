from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.projects import router as project_router
from app.api.v1.endpoints.tasks import router as task_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(project_router)
api_router.include_router(task_router)