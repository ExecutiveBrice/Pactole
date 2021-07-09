FROM python:3.9

RUN apt-get update

ADD ./app /

RUN pip install -r requirements.txt

ENTRYPOINT ["python", "./app.py"]