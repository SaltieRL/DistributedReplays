#!/usr/bin/env bash
sudo -u postgres /home/postgres/venv/bin/celery -A backend.tasks.celery_tasks.celery beat -l debug
