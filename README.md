# Achievements system

## Development

### Setup

- Generate certificates using [mkcert](https://github.com/FiloSottile/mkcert):

      cd traefik/certs
      mkcert -cert-file dev.cert -key-file dev.pem "achieve.localhost" "*.achieve.localhost"
      
- Install package dependencies:

      (cd achiever; pip install '.[dev]'; pip uninstall -y htm-achiever)

- Download and build docker image dependencies:

      INFRA=dev make pull
      INFRA=dev make build

- Launch application:

      INFRA=dev make up
      
### Utility scripts

Autoformat code:

    ./dev/autoformat.sh

Install git hooks for running pre-commit checks:

    ./dev/install_git_hooks.sh
    