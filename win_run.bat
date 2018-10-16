echo OFF
title win_run
start redis/redis-server.exe
start python RLBotServer.py
start celery -A backend.tasks.celery_tasks.celery worker --pool=solo -l info
start flower --port=5555
cd webapp
npm start
EXIT
