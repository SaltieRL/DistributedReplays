#!/usr/bin/env bash
sudo -u postgres /home/postgres/venv3.6/bin/celery -A backend.tasks.celery_worker.celery beat -l debug