from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_projects: int
    active_projects: int
    completed_projects: int
    total_tasks: int
    todo_tasks: int
    in_progress_tasks: int
    completed_tasks: int
    high_priority_tasks: int
    completion_percentage: float

    tasks_completed: int
    tasks_remaining: int