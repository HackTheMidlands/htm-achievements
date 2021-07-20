#!/bin/bash

(
    cd api/
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
