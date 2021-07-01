#!/bin/bash

isort \
    --multi-line=3 \
    --trailing-comma \
    --force-grid-wrap=0 \
    --use-parentheses \
    --line-width=88 \
    api/app/

black api/app/
