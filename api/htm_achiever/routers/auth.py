import uuid
from typing import Optional, Union

import starlette
from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Cookie, Depends, Header, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import HttpUrl
from sqlalchemy.orm import Session

from .. import config, crud, models, validate
from ..dependencies import get_db

router = APIRouter()

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
#  oauth.register(
    #  name="twitter",
    #  api_base_url="https://api.twitter.com/1.1/",
    #  access_token_url="https://api.twitter.com/oauth/access_token",
    #  request_token_url="https://api.twitter.com/oauth/request_token",
    #  authorize_url="https://api.twitter.com/oauth/authenticate",
    #  client_id=config.TwitterOauthClientID,
    #  client_secret=config.TwitterOauthClientSecret,
    #  client_kwargs={
        #  "scope": config.TwitterOauthClientScopes,
    #  },
#  )


def _make_get_token(allow_invalid=False):
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


get_token = _make_get_token()
get_token_force = _make_get_token(allow_invalid=True)


def get_token_admin(token: models.Token = Depends(get_token)):
    if not token.admin:
        raise HTTPException(
            status_code=403, detail="Authentication token has insufficient permissions"
        )
    return token


@router.get("/login/{provider}", tags=["authentication"])
async def login(request: Request, provider: str, redirect: HttpUrl):
    validate.check_redirect(redirect)
    try:
        redirect_uri = request.url_for(f"auth_{provider}")
    except starlette.routing.NoMatchFound:
        raise HTTPException(status_code=400, detail="Invalid auth provider")

    # if provider != "discord":
    #     raise HTTPException(status_code=400, detail="Invalid auth provider")
    actual_provider = oauth.create_client(provider)

    request.session["redirect"] = redirect
    return await actual_provider.authorize_redirect(request, redirect_uri)


@router.get("/connect/{provider}", tags=["authentication"])
async def connect(
    request: Request,
    provider: str,
    redirect: HttpUrl,
    token: models.Token = Depends(get_token),
):
    validate.check_redirect(redirect)
    try:
        redirect_uri = request.url_for(f"auth_{provider}")
    except starlette.routing.NoMatchFound:
        raise HTTPException(status_code=400, detail="Invalid auth provider")

    actual_provider = oauth.create_client(provider)

    request.session["redirect"] = redirect
    request.session["connect_user"] = str(token.owner.id)
    return await actual_provider.authorize_redirect(request, redirect_uri)


@router.get("/auth/discord", tags=["authentication"])
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
        db_user = crud.modify_user(
            db, db_user, discord_username=username, discord_id=userid
        )

        request.session.pop("connect_user")
        return RedirectResponse(request.session.pop("redirect"))
    else:
        db_user = crud.get_user(db, f"discord:{userid}")
        if db_user:
            db_user.discord_username = username
        else:
            db_user = crud.create_user(db, discord_username=username, discord_id=userid)

        db_token = models.Token(
            owner=db_user,
            admin=crud.is_admin(db_user),
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


@router.get("/auth/twitter", tags=["authentication"])
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
        db_user = crud.modify_user(
            db, db_user, twitter_username=username, twitter_id=userid
        )

        request.session.pop("connect_user")
        return RedirectResponse(request.session.pop("redirect"))
    else:
        db_user = crud.get_user(db, f"twitter:{userid}")
        if db_user:
            db_user.twitter_username = username
        else:
            db_user = crud.create_user(db, twitter_username=username, twitter_id=userid)

        db_token = models.Token(
            owner=db_user,
            admin=crud.is_admin(db_user),
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


@router.get("/logout", tags=["authentication"])
async def logout(
    request: Request, redirect: HttpUrl, token: models.Token = Depends(get_token_force)
):
    validate.check_redirect(redirect)

    response = RedirectResponse(redirect)
    response.delete_cookie(key="token", domain="." + config.Domain)
    return response
