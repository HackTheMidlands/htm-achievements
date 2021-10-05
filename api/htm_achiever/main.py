from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from . import config
from .routers import achievements, auth, users, external

app = FastAPI(root_path="/api")
app.add_middleware(SessionMiddleware, secret_key=config.SessionSecret)


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(achievements.router)
app.include_router(external.router)
