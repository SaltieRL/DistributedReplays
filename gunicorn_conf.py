bind = '0.0.0.0:5000'
workers = 9
worker_connections = 1000
keepalive = 5
timeout = 60
keyfile = 'calculated2.key'
certfile = 'calculated_cert2.pem'
ca_certs = 'chain2.pem'


def child_exit(server, worker):
    from prometheus_client import multiprocess
    multiprocess.mark_process_dead(worker.pid)
