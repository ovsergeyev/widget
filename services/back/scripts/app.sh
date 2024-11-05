#!/bin/bash

# alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
cd src
# gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind=0.0.0.0:8000
gunicorn --access-logfile /var/access.log --error-logfile /var/error.log --log-level debug  main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind=0.0.0.0:8000