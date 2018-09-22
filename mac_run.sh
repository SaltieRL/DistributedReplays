#!/usr/bin/env python3
echo ************************** REDIS *************************
redis-server &
sleep 2
echo ************************** POSTGRES *************************
pg_ctl -D /usr/local/var/postgres start &
sleep 2
echo ************************** CELERY *************************
celery -A backend.tasks.celery_tasks.celery worker --pool=solo -l info
sleep 2
echo ************************** FLOWER *************************
flower --port=5555 &
sleep 2
echo ************************** PYTHON SERVER *************************
python3 RLBotServer.py
echo ************************** SUCCESSFULL *************************
