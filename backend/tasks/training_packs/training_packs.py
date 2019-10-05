import math
import os
import uuid
import datetime

from backend.tasks.training_packs.decrypt import create_shot, load_pack, reserialize
from backend.utils.file_manager import FileManager


class Shot:
    def __init__(self, game: str, frame: int, time_remaining: int):
        self.game = game
        self.frame = int(frame)
        try:
            self.timeRemaining = int(time_remaining)
        except:
            self.timeRemaining = 0


def load_replay(replay):
    try:
        protobuf_game = FileManager.get_proto(replay)
        data_frame = FileManager.get_pandas(replay)
        return protobuf_game, data_frame
    except:
        return None, None


def create_shots_from_replay(replay, player_id):
    try:
        proto, df = load_replay(replay)
    except:
        return [], []
    if proto is None or df is None:
        return [], []
    players = proto.players  # list(df.columns.levels[0])

    guid = proto.game_metadata.match_guid
    if guid is None:
        guid = proto.game_metadata.id
    shots_list = []
    shots_documentation = []
    for p in players:
        player = p.name
        id_ = p.id.id
        if id_ != player_id:
            continue  # skip players outside of the selected person
        hits = proto.game_stats.hits
        player_hits = [(hit, hits[i - 1] if i > 0 else None) for i, hit in enumerate(hits) if
                       hit.player_id.id == id_ and hit.shot]
        try:
            frame_numbers = [hit[0].frame_number for hit in player_hits]
            last_hits = [hit[1].frame_number for hit in player_hits]
        except:
            # TODO: investigate training pack errors
            return [], []
        for i, frame in enumerate(frame_numbers[:]):
            last_hit = last_hits[i]
            if last_hit is not None:
                frame_start = last_hit + 1
            else:
                frame_start = frame - 60
            for frame_num in range(frame_start, frame):
                row = df.iloc[frame_num]
                time_remaining = row['game']['seconds_remaining']
                ball_info = row['ball']
                ball_x = ball_info['pos_x']
                ball_y = ball_info['pos_y']
                ball_z = ball_info['pos_z']
                n = 12.1
                ball_vel_x = ball_info['vel_x'] / n
                ball_vel_y = ball_info['vel_y'] / n
                ball_vel_z = ball_info['vel_z'] / n
                magnitude = (ball_vel_x ** 2 + ball_vel_y ** 2 + ball_vel_z ** 2) ** 0.5
                # xy_mag = (ball_vel_x ** 2 + ball_vel_y ** 2) ** 0.5
                unit_x = ball_vel_x / magnitude
                unit_y = ball_vel_y / magnitude
                unit_z = ball_vel_z / magnitude
                pitch = math.asin(unit_z) * 65536.0 / (2 * math.pi)
                yaw = math.atan2(unit_y, unit_x) * 65536.0 / (2 * math.pi)
                yaw = round(yaw, 2)
                if p.is_orange:
                    yaw += 65536.0 / 2
                    ball_x = -ball_x
                    ball_y = -ball_y

                car_info = row[player]
                car_x = round(car_info['pos_x'], 3)
                car_y = round(car_info['pos_y'], 3)
                car_z = round(car_info['pos_z'], 3)

                car_rot_x = round(car_info['rot_x'] * 65536.0 / (2 * math.pi), 2)
                car_rot_y = round(car_info['rot_y'] * 65536.0 / (2 * math.pi), 2)
                car_rot_z = round(car_info['rot_z'] * 65536.0 / (2 * math.pi), 2)

                if p.is_orange:
                    car_x = -car_x
                    car_y = -car_y
                    car_rot_y += 65536.0 / 2

                print(car_z, magnitude)
                filters = [
                    car_z < 50,
                    magnitude > 100
                ]
                if all(filters):
                    shots_list.append(create_shot(ball_x=ball_x, ball_y=ball_y,
                                                  ball_z=ball_z, ball_vel_p=pitch,
                                                  ball_vel_y=yaw,
                                                  ball_vel_r=0.0, ball_vel_mag=round(magnitude, 5),
                                                  car_x=car_x, car_y=car_y, car_z=car_z,
                                                  car_rot_p=car_rot_z, car_rot_y=car_rot_y, car_rot_r=car_rot_x))
                    shots_documentation.append(Shot(guid, frame, time_remaining))
                    break
    return shots_list, shots_documentation


def create_pack_from_replays(replays, player_id):
    print(replays, player_id)
    shot_list = []
    shots_documentation = []
    for replay in replays:
        result = create_shots_from_replay(replay, player_id)
        new_shots, new_shots_documentation = result
        shot_list += new_shots
        shots_documentation += new_shots_documentation
    print(replays, player_id)
    if len(shot_list) == 0:
        print("Player", player_id, "had zero shots. Skipping...")
        return
    if len(shot_list) > 50:
        shot_list = shot_list[:50]
    dirname = os.path.dirname(os.path.abspath(__file__))
    # Use a basic pack to start with, to prevent having to write the skeleton out
    # We just want to replace the shots/name/guid
    pack = os.path.join(dirname, "packs", "1ShotBeckwithDefault.Tem")
    parsed_properties = load_pack(pack)
    shots = parsed_properties[6]
    print("Found", len(shot_list), "shots")
    shots.value = shot_list
    parsed_properties[6] = shots
    # Create new guid to make it unique
    new_hex = uuid.uuid4().hex
    bytes_array = bytes.fromhex(new_hex)
    string_value = ""
    for i in range(4):
        string_value += bytes_array[i * 4: (i + 1) * 4][::-1].hex()
    # guid
    parsed_properties[2].value = ("Guid", new_hex, string_value)
    # Name of pack
    parsed_properties[3].value = f"{player_id} {datetime.datetime.now().strftime('%d/%m/%y %H:%M')}"
    tpack = reserialize(parsed_properties)
    filename = os.path.join("data", [p.value[2].upper() for p in parsed_properties if p.name == "TM_Guid"][0] + ".Tem")
    with open(filename, "wb") as output:
        output.write(tpack)
    print("FN:", filename)
    return filename, [s.__dict__ for s in shots_documentation]
