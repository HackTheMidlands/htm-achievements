import uuid
from datetime import datetime
from typing import Any, Dict, List

from pydantic import BaseModel


class AchievementBase(BaseModel):
    name: str
    tags: Dict[str, Any]


class AchievementCreate(AchievementBase):
    pass


class Achievement(AchievementBase):
    id: uuid.UUID
    timestamp: datetime

    class Config:
        orm_mode = True


class Token(BaseModel):
    id: uuid.UUID
    created_at: datetime

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: uuid.UUID

    class Config:
        orm_mode = True
