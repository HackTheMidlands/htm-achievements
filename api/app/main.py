import uuid
from typing import List, Optional, Tuple, Union
from pydantic import HttpUrl

from authlib.integrations.starlette_client import OAuth
from fastapi import Cookie, Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware

from . import config, crud, models, schemas
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
        "scope": config.OauthClientScopes,
        "prompt": "none",
    },
)


MAX_LIMIT = 100


def check_limit(limit: int):
    if limit > MAX_LIMIT:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid limit: max limit is {MAX_LIMIT}",
        )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_token(
    token: Optional[Union[uuid.UUID, str]] = Cookie(None),
    x_token: Optional[Union[uuid.UUID, str]] = Header(None),
    db: Session = Depends(get_db),
):
    token = token or x_token
    if token is None:
        raise HTTPException(status_code=401, detail="Authentication token not provided")
    if not isinstance(token, uuid.UUID):
        raise HTTPException(
            status_code=401, detail="Authentication token not valid UUID"
        )

    db_token = crud.get_token(db, token)
    if not db_token:
        raise HTTPException(status_code=401, detail="Authentication token invalid")

    return db_token


def get_token_admin(token: models.Token = Depends(get_token)):
    if not token.admin:
        raise HTTPException(
            status_code=403, detail="Authentication token has insufficient permissions"
        )
    return token


@app.get("/login", tags=["authentication"])
async def login(redirect: HttpUrl, request: Request):
    if not redirect.host.endswith("." + config.Domain):
        raise HTTPException(status_code=404, detail="Invalid redirect url")

    request.session["redirect"] = redirect
    redirect_uri = request.url_for("auth")
    return await oauth.discord.authorize_redirect(request, redirect_uri)


@app.get("/auth", response_model=schemas.Token, tags=["authentication"])
async def auth(request: Request, db: Session = Depends(get_db)):
    token = await oauth.discord.authorize_access_token(request)
    resp = await oauth.discord.get("oauth2/@me", token=token)
    data = resp.json()
    if "user" in data:
        user = data["user"]
    else:
        raise HTTPException(status_code=500, detail="Authorization failed")

    username = f"{user['username']}#{user['discriminator']}"

    db_user = crud.get_user(db, username)
    if not db_user:
        db_user = models.User(username=username)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    db_token = models.Token(owner=db_user, admin=username in config.AdminList)
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    
    response = RedirectResponse(request.session["redirect"])
    response.set_cookie(key="token", value=str(db_token.id), max_age=7 * 24 * 60 * 60, domain="." + config.Domain)
    return response


@app.post("/users/", response_model=schemas.User, tags=["users"])
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_user = crud.get_user(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    db_user = models.User(username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/users/", response_model=List[schemas.User], tags=["users"])
def read_users(
    offset: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    check_limit(limit)
    return crud.get_users(db, (limit, offset))


@app.get("/users/@me", response_model=schemas.User, tags=["users"])
def read_me(token: models.Token = Depends(get_token)):
    return token.owner


@app.get("/users/{username}", response_model=schemas.User, tags=["users"])
def read_user(
    username: Union[uuid.UUID, str],
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_user = crud.get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.delete("/users/{username}", tags=["users"])
def delete_user(
    username: Union[uuid.UUID, str],
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_user = crud.get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()


@app.post(
    "/users/{username}/achievements",
    response_model=schemas.Achievement,
    tags=["achievements"],
)
def create_achievement(
    username: Union[uuid.UUID, str],
    achievement: schemas.AchievementCreate,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_user = crud.get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_achievement = crud.get_user_achievement(db, token.owner, achievement.name)
    if db_achievement:
        db.delete(db_achievement)

    db_achievement = models.Achievement(
        name=achievement.name,
        tags=achievement.tags,
        owner=db_user,
    )
    db.add(db_achievement)
    db.commit()
    db.refresh(db_achievement)
    return db_achievement


@app.get(
    "/users/@me/achievements",
    response_model=List[schemas.Achievement],
    tags=["achievements"],
)
def read_my_achievements(
    offset: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token),
):
    check_limit(limit)

    return crud.get_user_achievements(db, token.owner, (limit, offset))


@app.get(
    "/users/{username}/achievements",
    response_model=List[schemas.Achievement],
    tags=["achievements"],
)
def read_user_achievements(
    username: Union[uuid.UUID, str],
    offset: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    check_limit(limit)

    db_user = crud.get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.get_user_achievements(db, db_user, (limit, offset))


@app.get(
    "/users/@me/achievements/{achievement}",
    response_model=schemas.Achievement,
    tags=["achievements"],
)
def read_my_achievement(
    achievement: Union[uuid.UUID, str],
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token),
):
    db_achievement = crud.get_user_achievement(db, token.owner, achievement)
    if not db_achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return db_achievement


@app.get(
    "/users/{username}/achievements/{achievement}",
    response_model=schemas.Achievement,
    tags=["achievements"],
)
def read_user_achievement(
    username: Union[uuid.UUID, str],
    achievement: Union[uuid.UUID, str],
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_user = crud.get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_achievement = crud.get_user_achievement(db, db_user, achievement)
    if not db_achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return db_achievement


@app.delete(
    "/users/{username}/achievements/{achievement}",
    response_model=schemas.Achievement,
    tags=["achievements"],
)
def delete_user_achievement(
    username: Union[uuid.UUID, str],
    achievement: Union[uuid.UUID, str],
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_user = crud.get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_achievement = crud.get_user_achievement(db, db_user, achievement)
    if not db_achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")

    db.delete(db_achievement)
    db.commit()
