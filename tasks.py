from celery import Celery


def make_celery(app):
    celery = Celery(app.import_name, backend=app.config['CELERY_RESULT_BACKEND'],
                    broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    TaskBase = celery.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery.Task = ContextTask
    return celery


# WORKER SETUP

# broker_url = 'amqp://guest@localhost'  # Broker URL for RabbitMQ task queue
#
# celery = Celery(app.name, broker=broker_url)
# celery.config_from_object('celeryconfig')  # Your celery configurations in a celeryconfig.py

