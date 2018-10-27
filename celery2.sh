#!/usr/bin/env bash
sudo -u postgres /home/postgres/venv/bin/celery -A backend.tasks.celery_tasks.celery worker --loglevel=INFO --concurrency=4 -n worker1@%h
