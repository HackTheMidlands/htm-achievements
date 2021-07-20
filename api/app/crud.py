import uuid
from typing import List, Tuple, Union

from sqlalchemy.orm import Session

from . import models


def get_user(db: Session, username: Union[uuid.UUID, str]):
    if isinstance(username, uuid.UUID):
        f = models.User.id == username
    else:
        f = models.User.username == username
    user = db.query(models.User).filter(f).first()
    return user


def get_token(db: Session, token: uuid.UUID):
    tk = db.query(models.Token).filter_by(id=token).first()
    return tk


def get_users(db: Session, limit_offset: Tuple[int, int]):
    limit, offset = limit_offset
    users = db.query(models.User).offset(offset).limit(limit).all()
    return users


def count_users(db: Session) -> int:
    return db.query(models.User).count()


def get_achievement(db: Session, id: uuid.UUID):
    achieve = db.query(models.Achievement).filter_by(id=id).first()
    return achieve


def get_achievements(db: Session, limit_offset: Tuple[int, int]):
    limit, offset = limit_offset
    achieves = db.query(models.Achievement).offset(offset).limit(limit).all()
    return achieves


def count_achievements(db: Session) -> int:
    return db.query(models.Achievement).count()


def get_user_achievement(
    db: Session, user: models.User, achievement: Union[uuid.UUID, str]
):
    if isinstance(achievement, uuid.UUID):
        f = models.Achievement.id == achievement
    else:
        f = models.Achievement.name == achievement
    return user.achievements.filter(f).first()


def get_user_achievements(
    db: Session, user: models.User, limit_offset: Tuple[int, int]
):
    limit, offset = limit_offset
    return user.achievements.limit(limit).offset(offset).all()


def count_user_achievements(db: Session, user: models.User) -> int:
    return user.achievements.count()
