#!/bin/bash

(
    cd api/
    autoflake --recursive --remove-all-unused-imports --in-place app/
    isort \
        --multi-line=3 \
        --trailing-comma \
        --force-grid-wrap=0 \
        --use-parentheses \
        --line-width=88 \
        app/
    black app/
)

(
    cd admin/
    yarn format
)
