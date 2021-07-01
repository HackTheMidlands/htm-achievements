# Achievements system

## Development

### Setup

- Generate certificates using [mkcert](https://github.com/FiloSottile/mkcert):

      cd traefik/certs
      mkcert -cert-file dev.cert -key-file dev.pem "achieve.localhost" "*.achieve.localhost"
      
- Create a `.env` file using the `example.env` template:

      cp example.env .env

  You *will* need to fill in any missing fields, such as the OAuth scope stuff
  (see the [Discord OAuth guide](https://discord.com/developers/docs/topics/oauth2)).

- Download and build docker image dependencies:

      INFRA=dev make pull
      INFRA=dev make build

- Launch application:

      INFRA=dev make up
      
The infrastructure should now be running at `achieve.localhost`, make sure that
this resolves to `127.0.0.1`!
      
### Utility scripts

Prerequisite, make sure to install package dependencies:

      (cd achiever; pip install '.[dev]'; pip uninstall -y htm-achiever)

Autoformat code:

    ./dev/autoformat.sh

Install git hooks for running pre-commit checks:

    ./dev/install_git_hooks.sh
