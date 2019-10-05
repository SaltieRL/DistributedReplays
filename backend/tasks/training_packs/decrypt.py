import base64
import glob
import io
import os
import random
import struct
from typing import List

from Crypto import Random
from Crypto.Cipher import AES

from config import AES_KEY
from .crc import create_crc
from .parse import parse, serialize, Property

PARSED_DIR = "parsed"
PACK_DIR = "pack"
PROCESSED_DIR = "processed"


class AESCipher(object):
    def __init__(self, key):
        self.bs = AES.block_size  # 16 default
        self.key = key  # hashlib.sha256(key).digest()

    def encrypt(self, raw):
        raw = self._pad(raw)
        iv = Random.new().read(AES.block_size)
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        return base64.b64encode(iv + cipher.encrypt(raw))

    def encrypt_bytes(self, byts):
        cipher = AES.new(self.key, AES.MODE_ECB)
        return cipher.encrypt(byts)

    def decrypt_bytes(self, byts):
        cipher = AES.new(self.key, AES.MODE_ECB)
        return cipher.decrypt(byts)

    def _pad(self, s):
        num_addition = (self.bs - (len(s) % self.bs))
        if num_addition <= 8:
            num_addition += 16
        extension = bytes((num_addition * "\x00").encode())
        s = s + extension
        return s

    @staticmethod
    def _unpad(s):
        return s[:-ord(s[len(s) - 1:])]


def create_shot(ball_x=-182.3192, ball_y=4039.0, ball_z=262.1, ball_vel_p=8100, ball_vel_y=-14287,
                ball_vel_r=-828, ball_vel_mag=1439.8,
                car_x=0.0, car_y=0.0, car_z=30.0, car_rot_p=0, car_rot_y=16384, car_rot_r=0):
    time_limit = Property("FloatProperty", "TimeLimit", 10.0)
    shot = [{'ObjectArchetype': 'Archetypes.Ball.Ball_GameEditor', 'StartLocationX': ball_x,
             'StartLocationY': ball_y, 'StartLocationZ': ball_z, 'VelocityStartRotationP': ball_vel_p,
             'VelocityStartRotationY': ball_vel_y, 'VelocityStartRotationR': ball_vel_r,
             'VelocityStartSpeed': ball_vel_mag},
            {'ObjectArchetype': 'Archetypes.GameEditor.DynamicSpawnPointMesh', 'LocationX': car_x,
             'LocationY': car_y, 'LocationZ': car_z, 'RotationP': car_rot_p, 'RotationY': car_rot_y,
             'RotationR': car_rot_r},
            {'IsPC': True, 'LocationX': -599.9999, 'LocationY': -700.0001, 'LocationZ': 529.9955,
             'RotationP': -1952, 'RotationY': 14037, 'RotationR': 0}, None]
    return {'TimeLimit': time_limit, 'data': shot}


def load_pack(fn):
    with open(fn, "rb") as f:
        chunk_size = f.read(4)  # CRC stuff
        # size = struct.unpack("<I", chunk_size)

        check = f.read(4)  # CRC stuff
        byte = f.read()
        # chunk_size_int = struct.unpack("<I", chunk_size)[0]
        # check_int = struct.unpack("<I", check)[0]

        aes = AESCipher(AES_KEY)

        result = aes.decrypt_bytes(byte)

        parsed_properties = parse(io.BytesIO(result))
    return parsed_properties


def encrypt_test_pack():
    with open('test.pack', 'rb') as f:
        recreated = f.read()

    aes = AESCipher(AES_KEY)
    # # Re-encrypt
    padded = aes._pad(recreated)

    encrypted = aes.encrypt_bytes(padded)
    #
    check_int_generated = struct.pack("<I", create_crc(encrypted))
    size_int_generated = struct.pack("<I", len(encrypted))

    file = size_int_generated + check_int_generated + encrypted
    with open("test.Tem", "wb") as output:
        output.write(file)


def reserialize(parsed_properties: List[Property]):
    recreated = serialize(parsed_properties)

    with open('test.pack', 'wb') as f:
        f.write(recreated)

    aes = AESCipher(AES_KEY)
    # # Re-encrypt
    padded = aes._pad(recreated)

    with open('padded.pack', 'wb') as f:
        f.write(padded)

    encrypted = aes.encrypt_bytes(padded)
    #
    check_int_generated = struct.pack("<I", create_crc(encrypted))
    size_int_generated = struct.pack("<I", len(encrypted))

    file = size_int_generated + check_int_generated + encrypted
    return file


if __name__ == '__main__':
    encrypt_test_pack()
    files = glob.glob("packs/*.Tem")
    for fn in files:
        with open(fn, "rb") as f:
            chunk_size = f.read(4)  # CRC stuff
            size = struct.unpack("<I", chunk_size)

            check = f.read(4)  # CRC stuff
            byte = f.read()
        try:
            chunk_size_int = struct.unpack("<I", chunk_size)[0]
            check_int = struct.unpack("<I", check)[0]

            aes = AESCipher(AES_KEY)

            result = aes.decrypt_bytes(byte)

            with open(os.path.join(PARSED_DIR, os.path.basename(fn) + ".pack"), "wb") as output:
                output.write(result)

            parsed_properties = parse(io.BytesIO(result))
            shots = parsed_properties[6]


            def create_shot(ball_x=-182.3192, ball_y=4039.0, ball_z=262.1, ball_vel_p=8100, ball_vel_y=-14287,
                            ball_vel_r=-828, ball_vel_mag=1439.8,
                            car_x=0.0, car_y=0.0, car_z=30.0, car_rot_p=0, car_rot_y=16384, car_rot_r=0,
                            time_limit=10.0):
                time_limit = Property("FloatProperty", "TimeLimit", time_limit)
                shot = [{'ObjectArchetype': 'Archetypes.Ball.Ball_GameEditor', 'StartLocationX': ball_x,
                         'StartLocationY': ball_y, 'StartLocationZ': ball_z, 'VelocityStartRotationP': ball_vel_p,
                         'VelocityStartRotationY': ball_vel_y, 'VelocityStartRotationR': ball_vel_r,
                         'VelocityStartSpeed': ball_vel_mag},
                        {'ObjectArchetype': 'Archetypes.GameEditor.DynamicSpawnPointMesh', 'LocationX': car_x,
                         'LocationY': car_y, 'LocationZ': car_z, 'RotationP': car_rot_p, 'RotationY': car_rot_y,
                         'RotationR': car_rot_r},
                        {'IsPC': True, 'LocationX': -599.9999, 'LocationY': -700.0001, 'LocationZ': 529.9955,
                         'RotationP': -1952, 'RotationY': 14037, 'RotationR': 0}, None]
                return {'TimeLimit': time_limit, 'data': shot}


            # lst = shots.value
            lst = []
            for x in range(4):
                lst.append(create_shot(ball_x=random.randrange(-2000, 2000), ball_y=random.randrange(-4000, 4000),
                                       ball_z=random.randrange(100, 2000), ball_vel_p=random.randrange(-4000, 4000),
                                       ball_vel_y=random.randrange(-4000, 4000),
                                       ball_vel_r=random.randrange(-4000, 4000),
                                       ball_vel_mag=random.randrange(100, 4000)))

            shots.value = lst
            parsed_properties[6] = shots

            recreated = serialize(parsed_properties)

            with open('test.pack', 'wb') as f:
                f.write(recreated)

            # # Re-encrypt
            padded = aes._pad(recreated)

            with open('padded.pack', 'wb') as f:
                f.write(padded)

            encrypted = aes.encrypt_bytes(padded)
            #
            check_int_generated = struct.pack("<I", create_crc(encrypted))
            size_int_generated = struct.pack("<I", len(encrypted))

            file = size_int_generated + check_int_generated + encrypted
            with open(os.path.join(PROCESSED_DIR,
                                   [p.value[2].upper() for p in parsed_properties if p.name == "TM_Guid"][0] + ".Tem"),
                      "wb") as output:
                output.write(file)
        except:
            pass
