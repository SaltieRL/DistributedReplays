#!/usr/bin/env bash
sudo -u postgres /home/postgres/venv3.6/bin/gunicorn -c gunicorn_conf.py loader:app