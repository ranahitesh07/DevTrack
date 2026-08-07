from pydantic import BaseModel, EmailStr


class UpdateProfile(BaseModel):
    username: str
    email: EmailStr


class ChangePassword(BaseModel):
    current_password: str
    new_password: str