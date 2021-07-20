FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8 as prod

ENV FORWARDED_ALLOW_IPS="*"

COPY ./setup.cfg ./pyproject.toml /app/
RUN pip install .

COPY ./ /app/
RUN pip install .

FROM prod as dev

CMD /start-reload.sh
