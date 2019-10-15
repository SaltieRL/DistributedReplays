#!/usr/bin/env bash
mkdir -p metrics
rm metrics/*
/home/postgres/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 loader:app --env prometheus_multiproc_dir="./metrics"
