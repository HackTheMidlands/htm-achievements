import os

DatabaseURL = os.environ["DATABASE_URL"]

AdminList = os.environ.get("ADMIN_LIST", "").split(",")

OauthClientID = os.environ["OAUTH_CLIENT_ID"]
OauthClientSecret = os.environ["OAUTH_CLIENT_SECRET"]
OauthClientScopes = "identify email"
