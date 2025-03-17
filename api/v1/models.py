from pydantic import BaseModel, Field, PositiveInt, EmailStr, field_validator
from typing import Literal, Optional, TypeAlias, Literal
from datetime import datetime, date
from assignment_ms.settings import MEDIA_URL
from os import path


class TokenAuth(BaseModel):
    """
    - `access_token` : Token value.
    - `token_type` : bearer
    """

    access_token: str
    token_type: Optional[str] = "bearer"
    role: Literal["Teacher", "Student"]

    model_config = {
        "json_schema_extras": {
            "example": {
                "access_token": "ams_27b9d79erc245r44b9rba2crd2273b5cbb71",
                "token_type": "bearer",
                "role": "Teacher",
            }
        }
    }


class Feedback(BaseModel):
    detail: str = Field(description="Feedback in details")

    model_config = {
        "json_schema_extra": {
            "example": {"detail": "This is a detailed feedback message."}
        }
    }


class Profile(BaseModel):
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    profile: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "username": "johndoe",
                "first_name": "John",
                "last_name": "Doe",
                "email": "johndoe@example.com",
                "profile": "/media/profiles/johndoe.jpg",
            }
        }
    }

    @field_validator("profile")
    def validate_document(value):
        if value:
            return path.join(MEDIA_URL, value)
        return value
