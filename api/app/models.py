import uuid
from typing import Any, List

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import Query, relationship
from sqlalchemy.sql import functions as func

from .db import Base


class User(Base):
    __tablename__ = "users"

    id: uuid.UUID = Column(
        UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4
    )
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    discord_id = Column(String, unique=True, index=True)
    discord_username = Column(String, unique=True, index=True)

    twitter_id = Column(String, unique=True, index=True)
    twitter_username = Column(String, unique=True, index=True)

    tokens: List["Token"] = relationship(
        "Token", back_populates="owner", uselist=True, cascade="all, delete"
    )
    achievements: Query = relationship(
        "Achievement", back_populates="owner", lazy="dynamic", cascade="all, delete"
    )


class Token(Base):
    __tablename__ = "tokens"

    id: uuid.UUID = Column(
        UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4
    )
    created_at = Column(DateTime, server_default=func.now())

    admin = Column(Boolean, default=False)

    owner_id: uuid.UUID = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    owner: User = relationship("User", back_populates="tokens", uselist=False)


class Achievement(Base):
    __tablename__ = "achievements"

    id: uuid.UUID = Column(
        UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4
    )
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    name = Column(String)
    tags: Any = Column(MutableDict.as_mutable(JSONB))

    owner_id: uuid.UUID = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    owner: User = relationship("User", back_populates="achievements", uselist=False)


class PendingAchievement(Base):
    __tablename__ = "pending_achievements"

    achievement_id: uuid.UUID = Column(
        UUID(as_uuid=True), ForeignKey("achievements.id"), primary_key=True
    )
    achievement: Achievement = relationship("Achievement")

    user_reference = Column(String)
