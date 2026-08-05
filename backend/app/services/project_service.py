from uuid import UUID

from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
)


def create_project(
    db: Session,
    user: User,
    project_data: ProjectCreate,
) -> Project:
    project = Project(
        user_id=user.id,
        title=project_data.title,
        description=project_data.description,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


def get_projects(
    db: Session,
    user: User,
):
    return (
        db.query(Project)
        .filter(Project.user_id == user.id)
        .all()
    )


def get_project(
    db: Session,
    user: User,
    project_id: UUID,
):
    return (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.user_id == user.id,
        )
        .first()
    )


def update_project(
    db: Session,
    project: Project,
    project_data: ProjectUpdate,
):
    if project_data.title is not None:
        project.title = project_data.title

    if project_data.description is not None:
        project.description = project_data.description

    if project_data.status is not None:
        project.status = project_data.status

    db.commit()
    db.refresh(project)

    return project


def delete_project(
    db: Session,
    project: Project,
):
    db.delete(project)
    db.commit()