import uuid
from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from .. import crud, models, schemas, validate
from ..dependencies import get_db
from .auth import get_token, get_token_admin

router = APIRouter()


@router.post(
    "/users/{userref}/achievements",
    response_model=schemas.Achievement,
    tags=["user-achievements"],
)
def create_user_achievement(
    userref: Union[uuid.UUID, str],
    achievement: schemas.AchievementCreateForUser,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_user = crud.get_user(db, userref)
    db_achievement = crud.create_achievement(
        db,
        name=achievement.name,
        tags=achievement.tags,
        owner=db_user,
        owner_ref=userref,
    )
    return db_achievement


@router.get(
    "/users/@me/achievements",
    response_model=List[schemas.Achievement],
    tags=["user-achievements"],
)
def read_my_achievements(
    response: Response,
    offset: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token),
):
    validate.check_limit(limit)
    response.headers["X-Total-Count"] = str(
        crud.count_user_achievements(db, token.owner)
    )
    return crud.get_user_achievements(db, token.owner, (limit, offset))


@router.get(
    "/users/{userref}/achievements",
    response_model=List[schemas.Achievement],
    tags=["user-achievements"],
)
def read_user_achievements(
    response: Response,
    userref: Union[uuid.UUID, str],
    offset: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    validate.check_limit(limit)

    db_user = crud.get_user(db, userref)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    response.headers["X-Total-Count"] = str(crud.count_user_achievements(db, db_user))
    return crud.get_user_achievements(db, db_user, (limit, offset))


@router.get(
    "/users/@me/achievements/{achievement}",
    response_model=schemas.Achievement,
    tags=["user-achievements"],
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


@router.get(
    "/users/{userref}/achievements/{achievement}",
    response_model=schemas.Achievement,
    tags=["user-achievements"],
)
def read_user_achievement(
    userref: Union[uuid.UUID, str],
    achievement: Union[uuid.UUID, str],
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_user = crud.get_user(db, userref)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_achievement = crud.get_user_achievement(db, db_user, achievement)
    if not db_achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return db_achievement


@router.delete(
    "/users/{userref}/achievements/{achievement}",
    response_model=schemas.Achievement,
    tags=["user-achievements"],
)
def delete_user_achievement(
    userref: Union[uuid.UUID, str],
    achievement: Union[uuid.UUID, str],
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_user = crud.get_user(db, userref)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_achievement = crud.get_user_achievement(db, db_user, achievement)
    if not db_achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")

    db.delete(db_achievement)
    db.commit()


@router.get(
    "/achievements/", response_model=List[schemas.Achievement], tags=["achievements"]
)
def read_achievements(
    response: Response,
    offset: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    validate.check_limit(limit)
    response.headers["X-Total-Count"] = str(crud.count_achievements(db))
    return crud.get_achievements(db, (limit, offset))


@router.get(
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


@router.post(
    "/achievements",
    response_model=schemas.Achievement,
    tags=["achievements"],
)
def create_achievement(
    achievement: schemas.AchievementCreate,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_user = crud.get_user(db, achievement.owner_ref)
    db_achievement = crud.create_achievement(
        db,
        name=achievement.name,
        tags=achievement.tags,
        owner=db_user,
        owner_ref=achievement.owner_ref,
    )
    return db_achievement


@router.delete(
    "/achievements/{achievement}",
    response_model=schemas.Achievement,
    tags=["achievements"],
)
def delete_achievement(
    achievement: uuid.UUID,
    db: Session = Depends(get_db),
    token: models.Token = Depends(get_token_admin),
):
    db_achievement = crud.get_achievement(db, achievement)
    if not db_achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")

    db.delete(db_achievement)
    db.commit()
