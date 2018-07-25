echo on
title win_setup
IF NOT EXIST "config.py" (
    ECHO Download or create a valid config file
    PAUSE
)
ELSE (
    git submodule init
    git submodule update
    mkdir rlreplays
    start pip install -r requirements.txt
    EXIT
)

