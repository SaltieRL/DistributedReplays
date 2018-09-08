# Calculated.gg Backend

## Setup
- Install Python 3.6/pip
- pip install -r requirements.txt
- Install and run Redis with default port + settings ([Windows](https://dingyuliang.me/redis-3-2-install-redis-windows/), [Ubuntu](https://redis.io/topics/quickstart))
- Install postgreSQL [Windows](https://www.enterprisedb.com/thank-you-downloading-postgresql?anid=1255928), [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04)
- If only for local development [change the password in Unbuntu](https://blog.2ndquadrant.com/how-to-safely-change-the-postgres-user-password-via-psql/) to `postgres`

## Running

### Ubuntu
- Run RLBotServer.py.

### Windows
- Run win_run.bat
- You can optionally kill the python process and start it in an IDE
- You can log into psql command line with `psql postgresql://postgres:postgres@localhost`

The server currently only allows uploads from a single IP address every 4.5 minutes, to prevent abuse.
This is also in-line with the data generation speed of a typical Rocket League game (~5 minutes).
Each replay has an IP address attached to it, so blame can be given.

## Structure

The structure of the server is split into different directories:

- `blueprints` - Backend Python code, split into subsections
- `database` - Database objects and queries
- `helpers` - Various scripts to help in maintaining the server
- `static` - Static website files (JS/CSS/images)
- `tasks` - Contains celery code user for processing the queue of replays
- `templates` - Dynamic website files (rendered HTML templates)
