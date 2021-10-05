import uuid
from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from .. import crud, models, schemas, validate
from ..dependencies import get_db
from .auth import get_token, get_token_admin

router = APIRouter()


@router.post("/users/", response_model=schemas.User, tags=["users"])
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    return crud.create_user(db)


@router.get("/users/", response_model=List[schemas.User], tags=["users"])
def read_users(
    response: Response,
    offset: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    validate.check_limit(limit)
    response.headers["X-Total-Count"] = str(crud.count_users(db))
    return crud.get_users(db, (limit, offset))


@router.get("/users/@me", response_model=schemas.User, tags=["users"])
def read_me(token: models.Token = Depends(get_token)):
    print('me!')
    return token.owner


@router.get("/users/{userref}", response_model=schemas.User, tags=["users"])
def read_user(
    userref: Union[uuid.UUID, str],
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_user = crud.get_user(db, userref)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.delete("/users/{userref}", tags=["users"])
def delete_user(
    userref: Union[uuid.UUID, str],
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_user = crud.get_user(db, userref)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    crud.delete_user(db, db_user)
