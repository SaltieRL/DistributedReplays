import os

enable_utc = True
worker_max_tasks_per_child = 100

redis_host = os.env.get('REDIS_HOST', 'localhost')
broker_url = 'redis://{}:6379/0'.format(redis_host)
result_backend = 'redis://{}:6379/0'.format(redis_host)
broker_transport_options = {'fanout_prefix': True}
