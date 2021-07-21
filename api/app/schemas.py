import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class AchievementBase(BaseModel):
    name: str
    tags: Dict[str, Any] = {}


class AchievementCreate(AchievementBase):
    pass


class Achievement(AchievementBase):
    id: uuid.UUID
    owner_id: uuid.UUID

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class Token(BaseModel):
    id: uuid.UUID
    created_at: datetime

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    discord_id: Optional[str]
    discord_username: Optional[str]

    twitter_id: Optional[str]
    twitter_username: Optional[str]


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
