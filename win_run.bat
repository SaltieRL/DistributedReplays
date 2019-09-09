echo OFF
title win_run
start redis/redis-server.exe
start cmd /k python RLBotServer.py
start cmd /k celery -A backend.tasks.celery_worker.celery worker --pool=solo -l info
start flower --port=5555
cd webapp
npm start
EXIT
