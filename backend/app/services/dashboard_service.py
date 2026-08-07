from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.task import Task
from app.models.user import User


def get_dashboard(
    db: Session,
    user: User,
):
    total_projects = (
        db.query(Project)
        .filter(Project.user_id == user.id)
        .count()
    )

    active_projects = (
        db.query(Project)
        .filter(
            Project.user_id == user.id,
            Project.status == "Active",
        )
        .count()
    )

    completed_projects = (
        db.query(Project)
        .filter(
            Project.user_id == user.id,
            Project.status == "Completed",
        )
        .count()
    )

    total_tasks = (
        db.query(Task)
        .join(Project)
        .filter(Project.user_id == user.id)
        .count()
    )

    todo_tasks = (
        db.query(Task)
        .join(Project)
        .filter(
            Project.user_id == user.id,
            Task.status == "Todo",
        )
        .count()
    )

    in_progress_tasks = (
        db.query(Task)
        .join(Project)
        .filter(
            Project.user_id == user.id,
            Task.status == "In Progress",
        )
        .count()
    )

    completed_tasks = (
        db.query(Task)
        .join(Project)
        .filter(
            Project.user_id == user.id,
            Task.status == "Completed",
        )
        .count()
    )

    high_priority_tasks = (
        db.query(Task)
        .join(Project)
        .filter(
            Project.user_id == user.id,
            Task.priority == "High",
        )
        .count()
    )

    completion_percentage = (
        round((completed_tasks / total_tasks) * 100, 2)
        if total_tasks > 0
        else 0
    )

    return {
        "total_projects": total_projects,
        "active_projects": active_projects,
        "completed_projects": completed_projects,
        "total_tasks": total_tasks,
        "todo_tasks": todo_tasks,
        "in_progress_tasks": in_progress_tasks,
        "completed_tasks": completed_tasks,
        "high_priority_tasks": high_priority_tasks,
        "completion_percentage": completion_percentage,
        "tasks_completed": completed_tasks,
        "tasks_remaining": total_tasks - completed_tasks,
    }