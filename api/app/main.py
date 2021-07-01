import uuid
from typing import List, Tuple, Union

from authlib.integrations.starlette_client import OAuth
from fastapi import Depends, FastAPI, HTTPException, Request
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware

from . import config, models, schemas
from .db import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="secret-string")

oauth = OAuth()
oauth.register(
    name="discord",
    api_base_url="https://discord.com/api/",
    access_token_url="https://discord.com/api/oauth2/token",
    authorize_url="https://discord.com/api/oauth2/authorize",
    client_id=config.OauthClientID,
    client_secret=config.OauthClientSecret,
    client_kwargs={
        "token_endpoint_auth_method": "client_secret_post",
        "scope": "identify email",
    },
)


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


@app.get("/login")
async def login(request: Request):
    redirect_uri = request.url_for("auth")
    return await oauth.discord.authorize_redirect(request, redirect_uri)


@app.get("/auth", response_model=schemas.Token)
async def auth(request: Request, db: Session = Depends(get_db)):
    token = await oauth.discord.authorize_access_token(request)
    resp = await oauth.discord.get("oauth2/@me", token=token)
    data = resp.json()
    if "user" in data:
        user = data["user"]
    else:
        raise HTTPException(status_code=500, detail="Authorization failed")

    username = f"{user['username']}#{user['discriminator']}"

    db_user = get_user(db, username)
    if not db_user:
        db_user = models.User(username=username)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    db_token = models.Token(owner=db_user)
    db.add(db_token)
    db.commit()
    db.refresh(db_token)

    return db_token


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = get_user(db, user.username)
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
