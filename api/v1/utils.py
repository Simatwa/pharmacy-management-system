"""Utilities fuctions for v1
"""

import uuid
import random
from string import ascii_lowercase
from typing import Literal
from users.models import CustomUser
from fastapi import HTTPException, status

token_id = "ams_"


def generate_token() -> str:
    """Generates api token"""
    return token_id + str(uuid.uuid4()).replace("-", random.choice(ascii_lowercase))


def ensure_user_is(role: Literal["Teacher", "Student"], user: CustomUser):
    """Checks that user's role matches the required role"""
    if role != user.role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Only {role.lower()}s are allowed to access this endpoint, not {user.role.lower()}s.",
        )
