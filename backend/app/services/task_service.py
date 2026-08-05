from uuid import UUID

from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate


def create_task(
    db: Session,
    user: User,
    task_data: TaskCreate,
):
    project = (
        db.query(Project)
        .filter(
            Project.id == task_data.project_id,
            Project.user_id == user.id,
        )
        .first()
    )

    if not project:
        return None

    task = Task(
        project_id=project.id,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        due_date=task_data.due_date,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


def get_tasks(
    db: Session,
    user: User,
):
    return (
        db.query(Task)
        .join(Project)
        .filter(Project.user_id == user.id)
        .all()
    )


def get_task(
    db: Session,
    user: User,
    task_id: UUID,
):
    return (
        db.query(Task)
        .join(Project)
        .filter(
            Task.id == task_id,
            Project.user_id == user.id,
        )
        .first()
    )


def update_task(
    db: Session,
    task: Task,
    task_data: TaskUpdate,
):
    update_data = task_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    return task


def delete_task(
    db: Session,
    task: Task,
):
    db.delete(task)
    db.commit()