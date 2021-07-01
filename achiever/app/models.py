import uuid
from typing import Any

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

    username = Column(String, unique=True, index=True)
    verified = Column(Boolean, default=False)

    achievements: Query = relationship(
        "Achievement", back_populates="owner", lazy="dynamic"
    )


class Achievement(Base):
    __tablename__ = "achievements"

    id: uuid.UUID = Column(
        UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4
    )

    name = Column(String)
    attributes: Any = Column(MutableDict.as_mutable(JSONB))
    timestamp = Column(DateTime, server_default=func.now())

    owner_id: uuid.UUID = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    owner: User = relationship("User", back_populates="achievements", uselist=False)
