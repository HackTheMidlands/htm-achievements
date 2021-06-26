FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8 as prod

COPY ./requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

COPY ./ /app/

FROM prod as dev

CMD /start-reload.sh

