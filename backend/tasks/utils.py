from backend.database.startup import get_strict_redis

PRIORITY_SEP = '\x06\x16'
DEFAULT_PRIORITY_STEPS = [0, 3, 6, 9]


def make_queue_name_for_pri(queue, pri):
    """Make a queue name for redis

    Celery uses PRIORITY_SEP to separate different priorities of tasks into
    different queues in Redis. Each queue-priority combination becomes a key in
    redis with names like:

     - batch1\x06\x163 <-- P3 queue named batch1

    There's more information about this in Github, but it doesn't look like it
    will change any time soon:

      - https://github.com/celery/kombu/issues/422

    In that ticket the code below, from the Flower project, is referenced:

      - https://github.com/mher/flower/blob/master/flower/utils/broker.py#L135

    :param queue: The name of the queue to make a name for.
    :param pri: The priority to make a name with.
    :return: A name for the queue-priority pair.
    """
    if pri not in DEFAULT_PRIORITY_STEPS:
        raise ValueError('Priority not in priority steps')
    return '{0}{1}{2}'.format(*((queue, PRIORITY_SEP, pri) if pri else
                                (queue, '', '')))


def get_queue_length(queue_name='celery'):
    """Get the number of tasks in a celery queue.

    :param queue_name: The name of the queue you want to inspect.
    :return: the number of items in the queue.
    """
    priority_names = [make_queue_name_for_pri(queue_name, pri) for pri in
                      DEFAULT_PRIORITY_STEPS]
    r = get_strict_redis()
    return [r.llen(x) for x in priority_names]


