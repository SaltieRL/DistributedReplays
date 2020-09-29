# Celery workers
import base64
import json
import os
import time
from enum import Enum, auto
from typing import Dict

import requests
from celery import Celery
from celery.result import AsyncResult
from celery.task import periodic_task
from requests import ReadTimeout

from backend.blueprints.spa_api.service_layers.leaderboards import Leaderboards
from backend.database.startup import lazy_get_redis, lazy_startup
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.stats.item_stats_wrapper import ItemStatsWrapper
from backend.database.wrapper.stats.player_stat_wrapper import PlayerStatWrapper
from backend.tasks import celeryconfig
from backend.tasks.add_replay import parse_replay
from backend.tasks.middleware import DBTask
from backend.tasks.periodic_stats import calculate_global_stats_by_playlist
from backend.tasks.utils import get_queue_length
from backend.utils.cloud_handler import GCPManager
from backend.utils.rlgarage_handler import RLGarageAPI

try:
    from backend.tasks.training_packs.task import TrainingPackCreation
    from backend.utils.metrics import METRICS_TRAINING_PACK_CREATION_TIME
except (ModuleNotFoundError, ImportError):
    TrainingPackCreation = None
    print("Missing config or AES Key and CRC, not creating training packs")

try:
    from backend.tasks.training_packs.training_packs import create_pack_from_replays
except:
    pass

celery = Celery(__name__, broker=celeryconfig.broker_url)


def create_celery_config():
    celery.config_from_object(celeryconfig)


player_wrapper = PlayerWrapper(limit=10)
player_stat_wrapper = PlayerStatWrapper(player_wrapper)


@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # sender.add_periodic_task(60 * 60 * 24 * 3, calculate_global_stats_by_rank.s(), name='calculate global stats every 3 days')
    # sender.add_periodic_task(60 * 60 * 24, calc_global_dists.s(), name='calculate global dists every day')
    # sender.add_periodic_task(60 * 60 * 24, calc_leaderboards.s(), name='calculate leaderboards every day')
    # sender.add_periodic_task(60 * 60 * 24 * 3, calc_leaderboards.s(), name='calculate item stats every 3 days')
    # sender.add_periodic_task(60 * 60 * 12, cache_item_stats.s(), name='cache item stats every 12 hours')
    sender.add_periodic_task(60 * 60 * 6, cache_items.s(), name='cache items every 6 hours')


def create_replay_task(file, filename, uuid, task_ids, query_params: Dict[str, any] = None):
    """
    Creates a new replay task.  It may optionally upload to GCP
    :param file:
    :param filename:
    :param uuid:
    :param task_ids:
    :param query_params:
    :return:
    """
    if GCPManager.should_go_to_gcp(get_queue_length):
        encoded_file = base64.b64encode(file.read())
        try:
            r = requests.post(GCPManager.get_gcp_url(), data=encoded_file, timeout=10,
                              params={**{'uuid': uuid}, **query_params})
        except ReadTimeout as e:
            pass  # we don't care, it's given
        except Exception as e:
            # make sure we do not lose the replay file
            file.seek(0)
            file.save(filename)  # oops, error so lets save the file
            raise e
    else:
        file.save(filename)
        result = add_replay_parse_task(os.path.abspath(filename), query_params)
        task_ids.append(result.id)


def add_replay_parse_task(replay_to_parse_path, query_params: Dict[str, any] = None, **kwargs):
    return parse_replay_task.delay(*[replay_to_parse_path], **{**kwargs, **{'query_params': query_params}}, )


@celery.task(bind=True, priority=5)
def parse_replay_task(self, *args, **kwargs):
    return parse_replay(self, *args, **kwargs)


@celery.task(base=DBTask, bind=True, priority=9)
def parse_replay_task_low_priority(self, fn):
    return parse_replay_task(replay_to_parse_path=fn, preserve_upload_date=True)


@celery.task(base=DBTask, bind=True, priority=9)
def parse_replay_gcp(self, fn, gcp_url):
    with open(fn, 'rb') as f:
        encoded_file = base64.b64encode(f.read())
    r = requests.post(gcp_url, data=encoded_file, timeout=0.5)


@periodic_task(run_every=30.0, base=DBTask, bind=True, priority=0)
def calculate_global_stats_by_rank(self):
    sess = self.session()
    result = player_stat_wrapper.get_global_stats(sess)
    sess.close()
    if lazy_get_redis() is not None:
        lazy_get_redis().set('global_stats_by_rank', json.dumps(result))
        lazy_get_redis().set('global_stats_expire', json.dumps(True))
    print('Done')
    return result


@periodic_task(run_every=24 * 60, base=DBTask, bind=True, priority=0)
def calc_leaderboards(self):
    leaderboards = Leaderboards.create()
    if lazy_get_redis() is not None:
        lazy_get_redis().set("leaderboards", json.dumps([l.__dict__ for l in leaderboards]))


@periodic_task(run_every=60 * 10, base=DBTask, bind=True, priority=0)
def calc_global_dists(self, session=None):
    if session is None:
        sess = self.session()
    else:
        sess = session
    calculate_global_stats_by_playlist(session)
    sess.close()


@periodic_task(run_every=24 * 60 * 60 * 3, base=DBTask, bind=True, priority=0)
def calc_item_stats(self, session=None):
    if session is None:
        sess = self.session()
    else:
        sess = session
    results = ItemStatsWrapper.create_stats(sess)
    sess.close()
    if lazy_get_redis() is not None:
        lazy_get_redis().set('item_stats', json.dumps(results))


# Uses fancy algorithm to make pack
@celery.task(base=DBTask, bind=True, priority=9)
def auto_create_training_pack(self, requester_id, pack_player_id, name=None, n=10, date_start=None, date_end=None,
                              replays=None, session=None):
    if session is None:
        sess = self.session()
    else:
        sess = session
    start = time.time()
    if requester_id == "":
        requester_id = "0"
    url = TrainingPackCreation.create_from_player(self.request.id, requester_id, pack_player_id, n, date_start,
                                                  date_end, name, replays, sess)
    end = time.time()
    METRICS_TRAINING_PACK_CREATION_TIME.observe(
        start - end
    )
    sess.close()
    return url


# Must specify all attributes
@celery.task(base=DBTask, bind=True, priority=9)
def create_manual_training_pack(self, requester_id, players, replays, frames, name=None, mode=False,
                                session=None):
    if session is None:
        sess = self.session()
    else:
        sess = session
    start = time.time()
    url = TrainingPackCreation.create_custom_pack(self.request.id, requester_id, players, replays, frames, name, mode,
                                                  sess)
    end = time.time()
    METRICS_TRAINING_PACK_CREATION_TIME.observe(
        start - end
    )
    sess.close()
    return url


@celery.task(base=DBTask, bind=True, priority=9)
def cache_items(self):
    api = RLGarageAPI()
    api.cache_items()


@celery.task(base=DBTask, bind=True, priority=9)
def cache_item_stats(self, session=None):
    if session is None:
        session = self.session()
    api = RLGarageAPI()
    api.cache_items()
    items = api.get_item_list(0, 10000, override=True)['items']
    category_map = {
        'car': 1,
        'wheels': 2,
        'boost': 3,
        'topper': 4,
        'antenna': 5,
        'skin': 6,
        'trail': 9,
        'goal_explosion': 10,
        'banner': 11,
        'engine_audio': 12,
    }
    ItemStatsWrapper.create_unpainted_stats(session=session, override=True)
    ItemStatsWrapper.create_unpainted_stats(session=session, counts=True, override=True)
    for value in category_map.values():
        ItemStatsWrapper.create_unpainted_stats(value, session=session, override=True)
    for key in category_map:
        ItemStatsWrapper.get_most_used_by_column(key, session=session, override=True)
    for item in items:
        id_ = item['ingameid']
        if id_ is None:
            continue
        print("Item", item)
        try:
            ItemStatsWrapper.get_item_usage_over_time(id_, session=session, override=True)
        except Exception as e:
            print("Error", e)
    session.close()


class ResultState(Enum):
    PENDING = auto()
    STARTED = auto()
    RETRY = auto()
    FAILURE = auto()
    SUCCESS = auto()


def get_task_state(id_) -> ResultState:
    # NB: State will be PENDING for unknown ids.
    return ResultState[AsyncResult(id_, app=celery).state]


if __name__ == '__main__':
    sess = lazy_startup()
    cache_item_stats()
