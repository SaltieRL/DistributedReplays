sudo -u postgres /home/postgres/venv3.6/bin/celery -A tasks.celery_tasks.celery worker --loglevel=INFO --concurrency=4 -n worker1@%h
