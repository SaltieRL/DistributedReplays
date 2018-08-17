echo OFF
title win_run
IF NOT EXIST "rlreplays" (
    ECHO Run win_setup.
    PAUSE
) ELSE (
    start RLBotServer.py
    start celery -A tasks.celery_tasks.celery worker --pool=solo -l info
    start flower --port=5555
    EXIT
)
