import base64
import os
from typing import Dict

import requests
from requests import ReadTimeout

from backend.tasks import celery_tasks
from backend.tasks.utils import get_queue_length
from backend.utils.cloud_handler import GCPManager


def create_replay_task(file, filename, uuid, task_ids, query_params: Dict[str, any] = None):
    if GCPManager.should_go_to_gcp(get_queue_length):
        encoded_file = base64.b64encode(file.read())
        try:
            r = requests.post(GCPManager.get_gcp_url(), data=encoded_file, timeout=0.5,
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
        result = celery_tasks.add_replay_parse_task(os.path.abspath(filename), query_params)
        task_ids.append(result.id)
