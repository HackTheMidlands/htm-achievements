import uuid
from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from .. import crud, models, schemas, validate, config
from ..dependencies import get_db
from .auth import get_token, get_token_admin

router = APIRouter()


@router.post(
    "/{achievement_name}/{discord_id}/",
    response_model=schemas.Achievement_External,
    tags=["external"],
)
def achievement1(
    discord_id: str,
    token:str,
    achievement_name: str,
    db: Session = Depends(get_db),
    # token: models.Token = Depends(get_token_admin),
):
    if(token==config.ExternalAPIToken):
        db_user = crud.get_user(db, "discord:"+discord_id)
        if(db_user!= None):
            crud.create_achievement(db, achievement_name, db_user,tags={})
            return {"msg":"Success"}
        else:
            return {"msg":"No User"}
    else:
        return {"msg":"No Perms"}

