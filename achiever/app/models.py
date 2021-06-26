import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.sql import functions as func

from .db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    username = Column(String, unique=True, index=True)
    verified = Column(Boolean, default=False)

    achievements = relationship("Achievement", back_populates="owner", lazy="dynamic")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)

    name = Column(String)
    attributes = Column(MutableDict.as_mutable(JSONB))
    timestamp = Column(DateTime, server_default=func.now())

    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    owner = relationship("User", back_populates="achievements")
