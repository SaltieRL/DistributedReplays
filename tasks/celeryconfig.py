enable_utc = True
worker_max_tasks_per_child = 100

broker_url = 'redis://localhost:6379/0'
result_backend = 'redis://localhost:6379/0'
broker_transport_options = {'fanout_prefix': True}
