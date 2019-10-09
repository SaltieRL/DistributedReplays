import ctypes
try:
    from config import crcTables
except (ImportError, ModuleNotFoundError):
    crcTables = []


def calc_crc(data, startPos, len, crc):
    crc = ctypes.c_uint32(~(crc.value))

    for i in range(len):
        d = ctypes.c_ubyte(data[startPos + i])
        index = d.value ^ crc.value >> 24
        crc = crc.value << 8 ^ crcTables[index]
        crc = ctypes.c_uint32(crc)

    crc = ~(crc.value)
    return ctypes.c_uint32(crc)


def create_crc(data: bytes):
    crc = calc_crc(data, 0, len(data), ctypes.c_uint32(0xEFCBF201))
    return crc.value