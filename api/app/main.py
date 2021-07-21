import uuid
from typing import List, Optional, Tuple, Union

import starlette
from authlib.integrations.starlette_client import OAuth
from fastapi import Cookie, Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, Response
from pydantic import HttpUrl
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
    client_id=config.DiscordOauthClientID,
    client_secret=config.DiscordOauthClientSecret,
    client_kwargs={
        "token_endpoint_auth_method": "client_secret_post",
        "scope": config.DiscordOauthClientScopes,
        "prompt": "none",
    },
)
oauth.register(
    name="twitter",
    api_base_url="https://api.twitter.com/1.1/",
    access_token_url="https://api.twitter.com/oauth/access_token",
    request_token_url="https://api.twitter.com/oauth/request_token",
    authorize_url="https://api.twitter.com/oauth/authenticate",
    client_id=config.TwitterOauthClientID,
    client_secret=config.TwitterOauthClientSecret,
    client_kwargs={
        "scope": config.TwitterOauthClientScopes,
    },
)


MAX_LIMIT = 100


def check_limit(limit: int):
    if limit > MAX_LIMIT:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid limit: max limit is {MAX_LIMIT}",
        )


def check_redirect(redirect: HttpUrl):
    if not redirect.host.endswith("." + config.Domain):
        raise HTTPException(status_code=404, detail="Invalid redirect url")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def make_get_token(allow_invalid=False):
    def get_token(
        token: Optional[Union[uuid.UUID, str]] = Cookie(None),
        x_token: Optional[Union[uuid.UUID, str]] = Header(None),
        db: Session = Depends(get_db),
    ):
        token = token or x_token
        if token is None:
            if allow_invalid:
                return None
            raise HTTPException(
                status_code=401, detail="Authentication token not provided"
            )
        if not isinstance(token, uuid.UUID):
            if allow_invalid:
                return None

            raise HTTPException(
                status_code=401, detail="Authentication token not valid UUID"
            )

        db_token = crud.get_token(db, token)
        if not db_token:
            if allow_invalid:
                return None

            raise HTTPException(status_code=401, detail="Authentication token invalid")

        return db_token

    return get_token


get_token = make_get_token()
get_token_force = make_get_token(allow_invalid=True)


def get_token_admin(token: models.Token = Depends(get_token)):
    if not token.admin:
        raise HTTPException(
            status_code=403, detail="Authentication token has insufficient permissions"
        )
    return token


@app.get("/login/{provider}", tags=["authentication"])
async def login(request: Request, provider: str, redirect: HttpUrl):
    check_redirect(redirect)
    try:
        redirect_uri = request.url_for(f"auth_{provider}")
    except starlette.routing.NoMatchFound:
        raise HTTPException(status_code=400, detail="Invalid auth provider")

    if provider != "discord":
        raise HTTPException(status_code=400, detail="Invalid auth provider")
    actual_provider = oauth.create_client(provider)

    request.session["redirect"] = redirect
    return await actual_provider.authorize_redirect(request, redirect_uri)


@app.get("/connect/{provider}", tags=["authentication"])
async def connect(
    request: Request,
    provider: str,
    redirect: HttpUrl,
    token: models.Token = Depends(get_token),
):
    check_redirect(redirect)
    try:
        redirect_uri = request.url_for(f"auth_{provider}")
    except starlette.routing.NoMatchFound:
        raise HTTPException(status_code=400, detail="Invalid auth provider")

    actual_provider = oauth.create_client(provider)

    request.session["redirect"] = redirect
    request.session["connect_user"] = str(token.owner.id)
    return await actual_provider.authorize_redirect(request, redirect_uri)


@app.get("/auth/discord", tags=["authentication"])
async def auth_discord(request: Request, db: Session = Depends(get_db)):
    token = await oauth.discord.authorize_access_token(request)
    resp = await oauth.discord.get("oauth2/@me", token=token)
    data = resp.json()
    if "user" in data:
        user = data["user"]
    else:
        raise HTTPException(status_code=500, detail="Authorization failed")

    userid = user["id"]
    username = f"{user['username']}#{user['discriminator']}"

    if uid := request.session.get("connect_user"):
        db_user = crud.get_user(db, uuid.UUID(uid))
        db_user.discord_id = userid
        db_user.discord_username = username
        db.commit()

        request.session.pop("connect_user")
        return RedirectResponse(request.session.pop("redirect"))
    else:
        db_user = crud.get_user(db, f"discord:{userid}")
        if db_user:
            db_user.discord_username = username
        else:
            db_user = models.User(discord_username=username, discord_id=userid)
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

        db_token = models.Token(
            owner=db_user,
            admin=f"discord:{username}" in config.AdminList
            or f"discord:{userid}" in config.AdminList,
        )
        db.add(db_token)
        db.commit()
        db.refresh(db_token)

        response = RedirectResponse(request.session.pop("redirect"))
        response.set_cookie(
            key="token",
            value=str(db_token.id),
            max_age=7 * 24 * 60 * 60,
            domain="." + config.Domain,
        )
        return response


@app.get("/auth/twitter", tags=["authentication"])
async def auth_twitter(request: Request, db: Session = Depends(get_db)):
    token = await oauth.twitter.authorize_access_token(request)
    resp = await oauth.twitter.get(
        "account/verify_credentials.json", params={"skip_status": True}, token=token
    )
    if resp.status_code != 200:
        raise HTTPException(status_code=500, detail="Authorization failed")
    user = resp.json()

    userid = user["id"]
    username = user["screen_name"]

    if uid := request.session.get("connect_user"):
        db_user = crud.get_user(db, uuid.UUID(uid))
        db_user.twitter_id = userid
        db_user.twitter_username = username
        db.commit()

        request.session.pop("connect_user")
        return RedirectResponse(request.session.pop("redirect"))
    else:
        db_user = crud.get_user(db, f"twitter:{userid}")
        if db_user:
            if db_user.twitter_username != username:
                db_user.twitter_username = username
        else:
            db_user = models.User(twitter_username=username, twitter_id=userid)
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

        db_token = models.Token(
            owner=db_user,
            admin=f"twitter:{username}" in config.AdminList
            or f"twitter:{userid}" in config.AdminList,
        )
        db.add(db_token)
        db.commit()
        db.refresh(db_token)

        response = RedirectResponse(request.session["redirect"])
        response.set_cookie(
            key="token",
            value=str(db_token.id),
            max_age=7 * 24 * 60 * 60,
            domain="." + config.Domain,
        )
        return response


@app.get("/logout", tags=["authentication"])
async def logout(
    request: Request, redirect: HttpUrl, token: models.Token = Depends(get_token_force)
):
    check_redirect(redirect)

    response = RedirectResponse(redirect)
    response.delete_cookie(key="token", domain="." + config.Domain)
    return response


@app.post("/users/", response_model=schemas.User, tags=["users"])
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_user = models.User()
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/users/", response_model=List[schemas.User], tags=["users"])
def read_users(
    response: Response,
    offset: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    check_limit(limit)
    response.headers["X-Total-Count"] = str(crud.count_users(db))
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


@app.get(
    "/achievements/", response_model=List[schemas.Achievement], tags=["achievements"]
)
def read_achievements(
    response: Response,
    offset: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    check_limit(limit)
    response.headers["X-Total-Count"] = str(crud.count_achievements(db))
    return crud.get_achievements(db, (limit, offset))


@app.get(
    "/achievements/{id}", response_model=schemas.Achievement, tags=["achievements"]
)
def read_achievement(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_achieve = crud.get_achievement(db, id)
    if not db_achieve:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return db_achieve


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
    response: Response,
    offset: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token),
):
    check_limit(limit)
    response.headers["X-Total-Count"] = str(
        crud.count_user_achievements(db, token.owner)
    )
    return crud.get_user_achievements(db, token.owner, (limit, offset))


@app.get(
    "/users/{username}/achievements",
    response_model=List[schemas.Achievement],
    tags=["achievements"],
)
def read_user_achievements(
    response: Response,
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

    response.headers["X-Total-Count"] = str(crud.count_user_achievements(db, db_user))
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
