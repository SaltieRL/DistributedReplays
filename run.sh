#!/usr/bin/env bash
gunicorn -w 4 -b 0.0.0.0:5000 gunicorn_loader:app
