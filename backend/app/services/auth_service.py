from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.schemas.settings import (
    UpdateProfile,
)


def register_user(db: Session, user_data: UserCreate) -> User:
    # Check if email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered")

    # Check if username already exists
    existing_username = (
        db.query(User)
        .filter(User.username == user_data.username)
        .first()
    )

    if existing_username:
        raise ValueError("Username already taken")

    # Create new user
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

def login_user(db: Session, username: str, password: str):
    # Find user by username
    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    # User not found
    if not user:
        raise ValueError("Invalid username or password")

    # Wrong password
    if not verify_password(password, user.hashed_password):
        raise ValueError("Invalid username or password")

    # Create JWT token
    access_token = create_access_token(
        data={"sub": str(user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

def update_profile(
    db: Session,
    user: User,
    data: UpdateProfile,
):
    existing_username = (
        db.query(User)
        .filter(
            User.username == data.username,
            User.id != user.id,
        )
        .first()
    )

    if existing_username:
        raise ValueError(
            "Username already taken"
        )

    existing_email = (
        db.query(User)
        .filter(
            User.email == data.email,
            User.id != user.id,
        )
        .first()
    )

    if existing_email:
        raise ValueError(
            "Email already registered"
        )

    user.username = data.username
    user.email = data.email

    db.commit()
    db.refresh(user)

    return user

def change_password(
    db: Session,
    user: User,
    current_password: str,
    new_password: str,
):
    if not verify_password(
        current_password,
        user.hashed_password,
    ):
        raise ValueError(
            "Current password is incorrect"
        )

    user.hashed_password = hash_password(
        new_password
    )

    db.commit()
    db.refresh(user)

    return {
        "message": "Password changed successfully"
    }