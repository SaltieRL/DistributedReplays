# Calculated.gg Backend

## Setup

- pip Install Flask (`flask`).
- pip Install Flask login (`flask_login`)
- pip Install psycopg2 (`psycopg2`)
- pip Install carball (`carball`)
- Install [postgreSQL](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04)
- If only for local development [change the password](https://blog.2ndquadrant.com/how-to-safely-change-the-postgres-user-password-via-psql/) to `postgres`
- Run RLBotServer.py.

The server currently only allows uploads from a single IP address every 4.5 minutes, to prevent abuse.
This is also in-line with the data generation speed of a typical Rocket League game (~5 minutes).
Each replay has an IP address attached to it, so blame can be given.

## Windows
- Install python/pip
- Install postgreSQL
- Install Redis (used for queue and caching)
- Run win_setup.bat
- Run win_run.bat

## Structure

The structure of the server is split into different directories:

- `blueprints` - Backend Python code, split into subsections
- `database` - Database objects and queries
- `helpers` - Various scripts to help in maintaining the server
- `static` - Static website files (JS/CSS/images)
- `tasks` - Contains celery code user for processing the queue of replays
- `templates` - Dynamic website files (rendered HTML templates)
