from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class TaskCreate(BaseModel):
    project_id: UUID
    title: str
    description: Optional[str] = None
    priority: str = "Medium"
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None


class TaskResponse(BaseModel):
    id: UUID
    project_id: UUID
    title: str
    description: Optional[str]
    status: str
    priority: str
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True