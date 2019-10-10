import datetime
import math
import os
import uuid

from backend.tasks.training_packs.parsing.decrypt import create_shot, load_pack, reserialize
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


def create_shots_from_replay(replay, player_id, frame=None):
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
        is_orange = p.is_orange
        if id_ != player_id:
            continue  # skip players outside of the selected person
        if frame is not None:
            filters, shot, shot_doc = create_shot_from_frame(df, frame, player, None, is_orange, guid)
            shots_list.append(shot)
            shots_documentation.append(shot_doc)
            break
        hits = proto.game_stats.hits
        player_hits = [(hit, hits[i - 1] if i > 0 else None) for i, hit in enumerate(hits) if
                       hit.player_id.id == id_ and hit.shot and not hit.dribble_continuation]
        try:
            frame_numbers = [hit[0].frame_number for hit in player_hits]
            last_hits = [hit[1].frame_number for hit in player_hits]
        except:
            # TODO: investigate training pack errors
            return [], []
        for i, frame in enumerate(frame_numbers[:]):
            player_hit = player_hits[i][0]
            last_hit = last_hits[i]
            if player_hits[i][0].goal_number != player_hits[i][1].goal_number:
                # we don't want to accidentally use kickoffs as a "shot"
                # this causes shots that are going into the goal because the "next hit" is this player's kickoff
                continue
            if last_hit is not None:
                frame_start = last_hit + 1
            else:
                continue  # skip this one
            for frame_num in range(frame_start, frame):
                filters, shot, shot_doc = create_shot_from_frame(df, frame_num, player, player_hit, is_orange, guid)
                if all(filters):
                    shots_list.append(shot)
                    shots_documentation.append(shot_doc)
                    break
    return shots_list, shots_documentation


def create_shot_from_frame(df, frame_num, player, player_hit, is_orange, guid):
    row = df.iloc[frame_num]
    time_remaining = row['game']['seconds_remaining']
    ball_info = row['ball']
    ball_x = ball_info['pos_x']
    ball_y = ball_info['pos_y']
    ball_z = ball_info['pos_z']
    n = 10
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
    if player_hit is not None and player_hit.dribble:
        magnitude = 0
    if is_orange:
        # flip ball around
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
    if is_orange:
        # flip car around
        car_x = -car_x
        car_y = -car_y
        car_rot_y += 65536.0 / 2
    filters = [
        car_z < 50,
        magnitude > 500
    ]
    shot = create_shot(ball_x=ball_x, ball_y=ball_y,
                       ball_z=ball_z, ball_vel_p=pitch,
                       ball_vel_y=yaw,
                       ball_vel_r=0.0, ball_vel_mag=round(magnitude, 5),
                       car_x=car_x, car_y=car_y, car_z=car_z,
                       car_rot_p=car_rot_z, car_rot_y=car_rot_y, car_rot_r=car_rot_x)
    shot_doc = Shot(guid, frame_num, time_remaining)
    return filters, shot, shot_doc


def write_pack(shot_list, name=None, mode=False):
    """
    Write the training pack given a shot list
    :param shot_list: Shots to place in pack
    :param name: Name of pack
    :param mode: Mode (false=striker, true=goalie)
    :return: filename
    """
    dirname = os.path.dirname(os.path.abspath(__file__))
    # Use a basic pack to start with, to prevent having to write the skeleton out
    # We just want to replace the shots/name/guid
    base_pack = "1ShotBeckwithDefault.Tem"
    if mode:
        base_pack = "1ShotBeckwithDefaultGoalie.Tem"
    pack = os.path.join(dirname, "packs", base_pack)
    parsed_properties = load_pack(pack)
    shots = parsed_properties[6]
    print("Found" + str(len(shot_list)) + "shots")
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
    parsed_properties[3].value = name
    tpack = reserialize(parsed_properties)
    filename = os.path.join("data", [p.value[2].upper() for p in parsed_properties if p.name == "TM_Guid"][0] + ".Tem")
    with open(filename, "wb") as output:
        output.write(tpack)
    print("FN:", filename)
    return filename


def create_pack_from_replays(replays, player_id, name=None, mode=False):
    shot_list = []
    shots_documentation = []
    for replay in replays:
        result = create_shots_from_replay(replay, player_id)
        new_shots, new_shots_documentation = result
        shot_list += new_shots
        shots_documentation += new_shots_documentation
    if len(shot_list) == 0:
        print("Player", player_id, "had zero shots. Skipping...")
        return
    if len(shot_list) > 50:
        shot_list = shot_list[:50]
    filename = write_pack(shot_list, name, mode=mode)
    return filename, [s.__dict__ for s in shots_documentation]


def create_custom_pack_from_replays(replays, players, frames, name=None, mode=False):
    shot_list = []
    shots_documentation = []
    for replay, player_id, frame in zip(replays, players, frames):
        result = create_shots_from_replay(replay, player_id, frame)
        new_shots, new_shots_documentation = result
        shot_list += new_shots
        shots_documentation += new_shots_documentation
    if len(shot_list) == 0:
        print("Zero shots. Skipping...")
        return
    if len(shot_list) > 50:
        shot_list = shot_list[:50]
    filename = write_pack(shot_list, name, mode=mode)
    return filename, [s.__dict__ for s in shots_documentation]
