import RLBotServer
# use by the application worker
from backend.tasks.celery_tasks import celery

server = RLBotServer.start_app()
app = server.app
app.app_context().push()
