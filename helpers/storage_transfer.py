import datetime
import os
import sys

from google.api_core.exceptions import NotFound
from google.cloud import storage

sys.path.append(os.path.abspath('.'))

from backend.database.objects import Game, ObjectLocation
from backend.database.startup import lazy_startup

storage_client = storage.Client.from_service_account_json('creds.json')
replay_bucket_name = "calculatedgg-replays"
df_bucket_name = "calculatedgg-parsed"

buckets = [storage_client.get_bucket(name) for name in [replay_bucket_name, df_bucket_name]]
cold_buckets = [storage_client.get_bucket(name + '-cold') for name in [replay_bucket_name, df_bucket_name]]
session_factory = lazy_startup()

_session = session_factory()

q = _session.query(Game).filter(Game.upload_date < (datetime.datetime.now() - datetime.timedelta(days=30 * 1)))
num_per_page = 50
last_count = num_per_page
page_num = 0
while last_count == num_per_page:
    games = q[page_num * num_per_page:(page_num + 1) * num_per_page]
    last_count = len(games)

    for game in games:
        obl = _session.query(ObjectLocation).filter(ObjectLocation.hash == game.hash).first()
        if obl is not None and obl.archive:
            # we're already in the archive
            continue

        for bucket, cold_bucket in zip(buckets, cold_buckets):
            blob_name = game.hash + '.replay' + ('.gzip' if bucket.name.endswith('parsed') else '')
            blob = bucket.blob(blob_name)
            try:
                bucket.copy_blob(blob, cold_bucket)
                bucket.delete_blob(blob_name)
            except NotFound:
                print(f"Object {game.hash} not found.")

        obl = ObjectLocation(hash=game.hash, archive=True)
        _session.add(obl)
    _session.commit()
    page_num += 1
_session.close()
