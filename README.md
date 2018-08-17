# Saltie Replay Server

A replay collection server for [Saltie](https://github.com/RLBots/Saltie) the Deep Reinforcement Learning Bot

*Modeled after the [Leela Zero](https://github.com/gcp/leela-zero) distributed Go engine.*

## Setup

- Install Flask (`flask`).
- Install Flask login (`flask_login`)
- Install psycopg2 (`psycopg2`)
- Install [postgreSQL](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04)
- If only for local development [change the password](https://blog.2ndquadrant.com/how-to-safely-change-the-postgres-user-password-via-psql/) to `postgres`
- Run RLBotServer.py.

The server currently only allows uploads from a single IP address every 4.5 minutes, to prevent abuse.
This is also in-line with the data generation speed of a typical Rocket League game (~5 minutes).
Each replay has an IP address attached to it, so blame can be given.

##Windows
- Install python/pip
- Install postgreSQL
- Install RabbitMQ
- Run win_setup.bat
- Run win_run.bat

## Replays

Replays will be saved in `/replays` for later consumption. The server provides these files to clients.

## Structure

The structure of the server is split into different files:

- `celery_tasks.py` - this contains the tasks that run in the background (i.e. the replay parsing / pickling) using Celery workers
- `celeryconfig.py` - configuration for the Celery worker
- `constants.py` - things like dict of id -> car body name
- `functions.py` - general helper functions for the server
- `middleware.py` - classes that are used in the actual inner framework code of the server
- `objects.py` - SQL ORM objects such as the Replay and Model objects
- `replays.py` - contains all code pertaining to replay parsing (besides the Celery task)
- `saltie.py` - contains all code pertaining to the Saltie data collection part
- `startup.py` - is run to start the connection to the SQL server
- `stats.py` - just some analysis on the upload patterns of the users

