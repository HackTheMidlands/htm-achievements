import uuid
from typing import List, Tuple, Union

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from . import models, schemas
from .db import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


ALLOWED_LIMITS = (25, 50, 75, 100)


def check_limit(limit: int):
    if limit not in ALLOWED_LIMITS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid limit: allowed limits are {ALLOWED_LIMITS}",
        )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user(db: Session, username: Union[uuid.UUID, str]):
    if isinstance(username, uuid.UUID):
        f = models.User.id == username
    else:
        f = models.User.username == username
    user = db.query(models.User).filter(f).first()
    return user


def get_users(db: Session, limit_offset: Tuple[int, int]):
    limit, offset = limit_offset
    users = db.query(models.User).offset(offset).limit(limit).all()
    return users


def get_user_achievement(db: Session, user: models.User, achievement: uuid.UUID):
    return user.achievements.filter_by(id=achievement).first()


def get_user_achievements(
    db: Session, user: models.User, limit_offset: Tuple[int, int]
):
    limit, offset = limit_offset
    return user.achievements.limit(limit).offset(offset).all()


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = get_user(db, user.username)
    print(user)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    db_user = models.User(username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/users/", response_model=List[schemas.User])
def read_users(offset: int = 0, limit: int = 25, db: Session = Depends(get_db)):
    check_limit(limit)
    return get_users(db, (limit, offset))


@app.get("/users/{username}", response_model=schemas.User)
def read_user(username: Union[uuid.UUID, str], db: Session = Depends(get_db)):
    db_user = get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.put("/users/{username}/verify", response_model=schemas.User)
def verify_user(username: Union[uuid.UUID, str], db: Session = Depends(get_db)):
    db_user = get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if db_user.verified:
        raise HTTPException(status_code=400, detail="User already verified")
    db_user.verified = True
    db.add(db_user)
    db.commit()
    return db_user


@app.delete("/users/{username}")
def delete_user(username: Union[uuid.UUID, str], db: Session = Depends(get_db)):
    db_user = get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()


@app.post("/users/{username}/achievements", response_model=schemas.Achievement)
def create_achievement(
    username: Union[uuid.UUID, str],
    achievement: schemas.AchievementCreate,
    db: Session = Depends(get_db),
):
    db_user = get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_achievement = models.Achievement(
        name=achievement.name,
        attributes=achievement.attributes,
        owner=db_user,
    )
    db.add(db_achievement)
    db.commit()
    db.refresh(db_achievement)
    return db_achievement


@app.get("/users/{username}/achievements", response_model=List[schemas.Achievement])
def read_user_achievements(
    username: Union[uuid.UUID, str],
    offset: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db),
):
    check_limit(limit)

    db_user = get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return get_user_achievements(db, db_user, (limit, offset))


@app.get(
    "/users/{username}/achievements/{achievement}", response_model=schemas.Achievement
)
def read_user_achievement(
    username: Union[uuid.UUID, str],
    achievement: uuid.UUID,
    db: Session = Depends(get_db),
):
    db_user = get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_achievement = get_user_achievement(db, db_user, achievement)
    if not db_achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return db_achievement
