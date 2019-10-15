#!/usr/bin/env bash
mkdir -p metrics
rm metrics/*
sudo -u postgres /home/postgres/venv3.6/bin/gunicorn -c gunicorn_conf.py loader:app --env prometheus_multiproc_dir="./metrics"