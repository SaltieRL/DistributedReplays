echo OFF
title win_run
start redis/redis-server.exe
start python RLBotServer.py
start celery -A tasks.celery_tasks.celery worker --pool=solo -l info
start flower --port=5555
EXIT
