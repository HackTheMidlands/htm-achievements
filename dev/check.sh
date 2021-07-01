#!/bin/sh

set -e

exec 1>&2

# formatting
isort --check \
    --multi-line=3 \
    --trailing-comma \
    --force-grid-wrap=0 \
    --use-parentheses \
    --line-width=88 \
    achiever/app/

black --check achiever/app/

# type checking
(cd achiever; mypy app)
