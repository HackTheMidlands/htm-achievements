import uuid
from datetime import datetime
from typing import Any, List, Dict

from pydantic import BaseModel


class AchievementBase(BaseModel):
    name: str
    attributes: Dict[str, Any]


class AchievementCreate(AchievementBase):
    pass


class Achievement(AchievementBase):
    id: uuid.UUID
    timestamp: datetime

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: uuid.UUID
    verified: bool
    achievements: List[Achievement]

    class Config:
        orm_mode = True
