#!/usr/bin/env bash
sleep 3
echo "killing server"
kill -9 `ps aux |grep gunicorn |grep app | awk '{ print $2 }'`  # will kill all of the workers
sleep 10
echo "server should be dead"


[["$0" == "test"]] && IS_TEST=0 || IS_TEST=1

# check that server is dead
wget localhost:5000 -O /dev/null
if [ $? -eq 0 ]; then
    echo "Server still running stopping upgrade"
    exit 1
else
    echo "Server is successfully dead"
fi

# update server
git checkout master
git pull

# build the frontend
npm run build

# run client

if [ $IS_TEST -eq 1 ]; then
    echo "running test instance"
    sh ./run.sh
else
    echo "running real instance"
    sh ./run-ssl.sh
fi
