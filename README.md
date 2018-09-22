# Calculated.gg Backend

## Setup
- Install Python 3.6/pip
- `pip3 install -r requirements.txt`
- Install and run Redis with default port + settings (Windows is included, [Ubuntu](https://redis.io/topics/quickstart))
- Install postgreSQL ([Windows](https://www.enterprisedb.com/thank-you-downloading-postgresql?anid=1255928), [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04), [Mac](https://stackoverflow.com/a/35308200/2187510))
- If only for local development [change the password in Unbuntu](https://blog.2ndquadrant.com/how-to-safely-change-the-postgres-user-password-via-psql/) to `postgres`
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

- Install Python 3.6/pip
- (Recommended) Create a virtual environment. todo(kcolton): finish + Pipfile
- [Docker Community Edition (Stable)](https://docs.docker.com/install/)
  
  Docker will run Postgres and Redis inside linux based "Containers" on most platforms. 
  Download and install Docker for your platform:    
  - [Mac/Windows: Docker Desktop](https://www.docker.com/products/docker-desktop)
  - [Ubuntu/Debian-ish: Docker CLI](https://docs.docker.com/install/linux/docker-ce/debian/#install-docker-ce)
- Start Postgres and Redis containers:

    ```bash
    # Start Postgres and Redis. Anytime ran will automatically download latest versions.
    # Should be in project root directory (where docker-compose.yml is)
    docker-compose up
    
    # See your containers running
    docker ps
    ```
    
    todo(kcolton): extended Docker docs
- Install [NodeJS](https://nodejs.org/en/) - 8 LTS Recommended (10 likely works as well).


### Python Requirements

- (Recommended) Activate virtual environment. todo(kcolton): finish 
- Install python requirements

    ```bash
    pip3 install -r requirements.txt
    ```
    
### React Webapp requirements via `npm` (Node Package Manager)

```bash
cd webapp
# if not found, upgrade npm or use: npm install
npm ci
```

### Start Application

todo(kcolton): alternative start methods

- Flask (Web framework for Backend API)

    ```bash
    # inside activated virtual environment if cerated
    python3 RLBotServer.py
    ```
    
- Celery (Background workers required for parsing replays and other tasks)

    ```bash
    # inside activated virtual environment if created
    celery -A backend.tasks.celery_tasks.celery worker --loglevel=INFO
    ```
    
- React Web Frontend (Run on separate port, make calls to Backend API for data)

    ```bash
    cd webapp
    npm run start
    ```

