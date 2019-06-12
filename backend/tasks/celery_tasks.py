# Celery workers
import base64
import json
from enum import Enum, auto
from typing import Dict

import requests
from celery import Celery
from celery.result import AsyncResult
from celery.task import periodic_task

from backend.blueprints.spa_api.service_layers.leaderboards import Leaderboards
from backend.database.startup import lazy_get_redis
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.stats.player_stat_wrapper import PlayerStatWrapper
from backend.tasks import celeryconfig
from backend.tasks.add_replay import parse_replay
from backend.tasks.middleware import DBTask
from backend.tasks.periodic_stats import calculate_global_distributions

celery = Celery(__name__, broker=celeryconfig.broker_url)


def create_celery_config():
    celery.config_from_object(celeryconfig)


player_wrapper = PlayerWrapper(limit=10)
player_stat_wrapper = PlayerStatWrapper(player_wrapper)


@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(60 * 60 * 3, calc_global_stats.s(), name='calculate global stats every 3 hrs')
    sender.add_periodic_task(60 * 60 * 24, calc_global_dists.s(), name='calculate global dists every day')
    sender.add_periodic_task(60 * 60 * 24, calc_leaderboards.s(), name='calculate leaderboards every day')


def add_replay_parse_task(file_name, query_params: Dict[str, any] = None, **kwargs):
    return parse_replay_task.delay(*[file_name], **{**kwargs, **{'query_params': query_params}}, )


@celery.task(bind=True, priority=5)
def parse_replay_task(self, *args, **kwargs):
    return parse_replay(self, *args, **kwargs)


@celery.task(base=DBTask, bind=True, priority=9)
def parse_replay_task_low_priority(self, fn):
    return parse_replay_task(filename=fn, preserve_upload_date=True)


@celery.task(base=DBTask, bind=True, priority=9)
def parse_replay_gcp(self, fn, gcp_url):
    with open(fn, 'rb') as f:
        encoded_file = base64.b64encode(f.read())
    r = requests.post(gcp_url, data=encoded_file, timeout=0.5)


@periodic_task(run_every=30.0, base=DBTask, bind=True, priority=0)
def calc_global_stats(self):
    sess = self.session()
    result = player_stat_wrapper.get_global_stats(sess)
    sess.close()
    if lazy_get_redis() is not None:
        lazy_get_redis().set('global_stats', json.dumps(result))
        lazy_get_redis().set('global_stats_expire', json.dumps(True))
    print('Done')
    return result


@periodic_task(run_every=24 * 60, base=DBTask, bind=True, priority=0)
def calc_leaderboards(self):
    leaderboards = Leaderboards.create()
    if lazy_get_redis() is not None:
        lazy_get_redis().set("leaderboards", json.dumps([l.__dict__ for l in leaderboards]))


@periodic_task(run_every=60 * 10, base=DBTask, bind=True, priority=0)
def calc_global_dists(self):
    calculate_global_distributions(self.session)


class ResultState(Enum):
    PENDING = auto()
    STARTED = auto()
    RETRY = auto()
    FAILURE = auto()
    SUCCESS = auto()


def get_task_state(id_) -> ResultState:
    # NB: State will be PENDING for unknown ids.
    return ResultState[AsyncResult(id_, app=celery).state]
