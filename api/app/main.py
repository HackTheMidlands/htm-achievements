from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from . import config, models
from .db import engine
from .routers import achievements, auth, users

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=config.SessionSecret)


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(achievements.router)
