# Calculated.gg Backend [![Build Status](https://api.travis-ci.org/SaltieRL/DistributedReplays.svg?branch=master)](https://travis-ci.org/SaltieRL/DistributedReplays)

## Setup
- Install Python 3.6/pip
- `pip3 install -r requirements.txt`
- Install and run Redis with default port + settings (Windows is included, [Ubuntu](https://redis.io/topics/quickstart))
- Install postgreSQL ([Windows](https://www.enterprisedb.com/thank-you-downloading-postgresql?anid=1255928), [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04), [Mac](https://stackoverflow.com/a/35308200/2187510))
- If only for local development [change the password in Ubuntu](https://blog.2ndquadrant.com/how-to-safely-change-the-postgres-user-password-via-psql/) to `postgres`
- Ensure you have the latest LTS version of node and npm installed
- Run `cd webapp`, `npm install`

## Running

#### Ubuntu
- Run RLBotServer.py.
- `cd webapp`, `npm start`

#### Windows
- Run win_run.bat
- You can optionally kill the python process and start it in an IDE
- You can log into psql command line with `psql postgresql://postgres:postgres@localhost`
- If the included redis does not work here is [install directions](https://dingyuliang.me/redis-3-2-install-redis-windows/)
- DO NOT USE IDLE, either use command line or pycharm (pycharm is recommended for development of backend)

#### Mac
- Run mac_run.sh

**You need to run in `python3`. Mac comes with `python2` by default so do not run any commands without the 3**




## Structure

The structure of the server is split into different directories:

- `blueprints` - Backend Python code, split into subsections
- `database` - Database objects and queries
- `helpers` - Various scripts to help in maintaining the server
- `static` - Static website files (JS/CSS/images)
- `tasks` - Contains celery code user for processing the queue of replays
- `templates` - Dynamic website files (rendered HTML templates)

---

## Setup and Running with Docker (Docs WIP)

### Basic Dependencies

- [Docker Community Edition (Stable)](https://docs.docker.com/install/)

  Docker will run Postgres, Redis, Flask, Celery, and Node inside linux based "Containers" on most platforms.
  Download and install Docker and Docker Compose for your platform:
  - [Mac/Windows: Docker Desktop](https://www.docker.com/products/docker-desktop)
  - [Ubuntu/Debian-ish: Docker CLI](https://docs.docker.com/install/linux/docker-ce/debian/#install-docker-ce)

### Run Everything
```bash
# Start containers. Should be in project root directory (where docker-compose.yml is)
docker-compose up

# See your containers running
docker ps
```

Now go to `localhost:3000` and the site should be running.
