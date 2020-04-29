import os

redis_server = os.getenv("REDIS_HOST", "localhost")
redis_port = os.getenv("REDIS_PORT", 6379)

enable_utc = True
worker_max_tasks_per_child = 100

broker_url = f'redis://{redis_server}:{redis_port}/0'
result_backend = f'redis://{redis_server}:{redis_port}/0'
broker_transport_options = {'fanout_prefix': True}
task_always_eager = False

# errors from a task that uses apply or is eager will pass up exceptions
task_eager_propagates = True