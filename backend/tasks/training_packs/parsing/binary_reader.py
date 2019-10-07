"""
Sourced from NEO Python Core

Copyright (c) 2017-2018 City of Zion

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""
import sys
import struct
import binascii
import importlib


class BinaryReader(object):
    """docstring for BinaryReader"""

    def __init__(self, stream):
        """
        Create an instance.

        Args:
            stream (BytesIO): a stream to operate on. i.e. a neo.IO.MemoryStream or raw BytesIO.
        """
        super(BinaryReader, self).__init__()
        self.stream = stream

    def unpack(self, fmt, length=1):
        """
        Unpack the stream contents according to the specified format in `fmt`.
        For more information about the `fmt` format see: https://docs.python.org/3/library/struct.html

        Args:
            fmt (str): format string.
            length (int): amount of bytes to read.

        Returns:
            variable: the result according to the specified format.
        """
        return struct.unpack(fmt, self.stream.read(length))[0]

    def ReadByte(self, do_ord=True):
        """
        Read a single byte.

        Args:
            do_ord (bool): (default True) convert the byte to an ordinal first.

        Returns:
            bytes: a single byte if successful. 0 (int) if an exception occurred.
        """
        try:
            if do_ord:
                return ord(self.stream.read(1))
            return self.stream.read(1)
        except Exception as e:
            # logger.error("ord expected character but got none")
            pass
        return 0

    def ReadBytes(self, length):
        """
        Read the specified number of bytes from the stream.

        Args:
            length (int): number of bytes to read.

        Returns:
            bytes: `length` number of bytes.
        """
        value = self.stream.read(length)
        return value

    def SafeReadBytes(self, length):
        """
        Read exactly `length` number of bytes from the stream.

        Raises:
            ValueError is not enough data

        Returns:
            bytes: `length` number of bytes
        """
        data = self.ReadBytes(length)
        if len(data) < length:
            raise ValueError("Not enough data available")
        else:
            return data

    def ReadBool(self):
        """
        Read 1 byte as a boolean value from the stream.

        Returns:
            bool:
        """
        return self.unpack('?')

    def ReadChar(self):
        """
        Read 1 byte as a character from the stream.

        Returns:
            str: a single character.
        """
        return self.unpack('c')

    def ReadFloat(self, endian="<"):
        """
        Read 4 bytes as a float value from the stream.

        Args:
            endian (str): specify the endianness. (Default) Little endian ('<'). Use '>' for big endian.

        Returns:
            float:
        """
        # return self.unpack("%sf" % endian, 4)
        return self.unpack("<f", 4)

    def ReadDouble(self, endian="<"):
        """
        Read 8 bytes as a double value from the stream.

        Args:
            endian (str): specify the endianness. (Default) Little endian ('<'). Use '>' for big endian.

        Returns:
            float:
        """
        return self.unpack("%sd" % endian, 8)

    def ReadInt8(self, endian="<"):
        """
        Read 1 byte as a signed integer value from the stream.

        Args:
            endian (str): specify the endianness. (Default) Little endian ('<'). Use '>' for big endian.

        Returns:
            int:
        """
        return self.unpack('%sb' % endian)

    def ReadUInt8(self, endian="<"):
        """
        Read 1 byte as an unsigned integer value from the stream.

        Args:
            endian (str): specify the endianness. (Default) Little endian ('<'). Use '>' for big endian.

        Returns:
            int:
        """
        return self.unpack('%sB' % endian)

    def ReadInt16(self, endian="<"):
        """
        Read 2 byte as a signed integer value from the stream.

        Args:
            endian (str): specify the endianness. (Default) Little endian ('<'). Use '>' for big endian.

        Returns:
            int:
        """
        return self.unpack('%sh' % endian, 2)

    def ReadUInt16(self, endian="<"):
        """
        Read 2 byte as an unsigned integer value from the stream.

        Args:
            endian (str): specify the endianness. (Default) Little endian ('<'). Use '>' for big endian.

        Returns:
            int:
        """
        return self.unpack('%sH' % endian, 2)

    def ReadInt32(self, endian="<"):
        """
        Read 4 bytes as a signed integer value from the stream.

        Args:
            endian (str): specify the endianness. (Default) Little endian ('<'). Use '>' for big endian.

        Returns:
            int:
        """
        return self.unpack('%si' % endian, 4)

    def ReadUInt32(self, endian="<"):
        """
        Read 4 bytes as an unsigned integer value from the stream.

        Args:
            endian (str): specify the endianness. (Default) Little endian ('<'). Use '>' for big endian.

        Returns:
            int:
        """
        return self.unpack('%sI' % endian, 4)

    def ReadInt64(self, endian="<"):
        """
        Read 8 bytes as a signed integer value from the stream.

        Args:
            endian (str): specify the endianness. (Default) Little endian ('<'). Use '>' for big endian.

        Returns:
            int:
        """
        return self.unpack('%sq' % endian, 8)

    def ReadUInt64(self, endian="<"):
        """
        Read 8 bytes as an unsigned integer value from the stream.

        Args:
            endian (str): specify the endianness. (Default) Little endian ('<'). Use '>' for big endian.

        Returns:
            int:
        """
        return self.unpack('%sQ' % endian, 8)

    def ReadVarInt(self, max=sys.maxsize):
        """
        Read a variable length integer from the stream.
        The NEO network protocol supports encoded storage for space saving. See: http://docs.neo.org/en-us/node/network-protocol.html#convention

        Args:
            max (int): (Optional) maximum number of bytes to read.

        Returns:
            int:
        """
        fb = self.ReadByte()
        if fb is 0:
            return fb
        value = 0
        if hex(fb) == '0xfd':
            value = self.ReadUInt16()
        elif hex(fb) == '0xfe':
            value = self.ReadUInt32()
        elif hex(fb) == '0xff':
            value = self.ReadUInt64()
        else:
            value = fb

        if value > max:
            raise Exception("Invalid format")

        return int(value)

    def ReadVarBytes(self, max=sys.maxsize):
        """
        Read a variable length of bytes from the stream.
        The NEO network protocol supports encoded storage for space saving. See: http://docs.neo.org/en-us/node/network-protocol.html#convention

        Args:
            max (int): (Optional) maximum number of bytes to read.

        Returns:
            bytes:
        """
        length = self.ReadVarInt(max)
        return self.ReadBytes(length)

    def ReadString(self) -> str:
        """
        Read a string from the stream.

        Returns:
            str:
        """
        length = self.ReadUInt32()
        return self.unpack(str(length) + 's', length)[:-1].decode()

    def ReadVarString(self, max=sys.maxsize):
        """
        Similar to `ReadString` but expects a variable length indicator instead of the fixed 1 byte indicator.

        Args:
            max (int): (Optional) maximum number of bytes to read.

        Returns:
            bytes:
        """
        length = self.ReadVarInt(max)
        return self.unpack(str(length) + 's', length)

    def ReadFixedString(self, length):
        """
        Read a fixed length string from the stream.
        Args:
            length (int): length of string to read.

        Returns:
            bytes:
        """
        return self.ReadBytes(length).rstrip(b'\x00')

    def ReadSerializableArray(self, class_name, max=sys.maxsize):
        """
        Deserialize a stream into the object specific by `class_name`.

        Args:
            class_name (str): a full path to the class to be deserialized into. e.g. 'neo.Core.Block.Block'
            max (int): (Optional) maximum number of bytes to read.

        Returns:
            list: list of `class_name` objects deserialized from the stream.
        """
        module = '.'.join(class_name.split('.')[:-1])
        klassname = class_name.split('.')[-1]
        klass = getattr(importlib.import_module(module), klassname)
        length = self.ReadVarInt(max=max)
        items = []
        #        logger.info("READING ITEM %s %s " % (length, class_name))
        try:
            for i in range(0, length):
                item = klass()
                item.Deserialize(self)
                #                logger.info("deserialized item %s %s " % ( i, item))
                items.append(item)
        except Exception as e:
            # logger.error("Couldn't deserialize %s " % e)
            pass
        return items
    #
    # def ReadUInt256(self):
    #     """
    #     Read a UInt256 value from the stream.
    #
    #     Returns:
    #         UInt256:
    #     """
    #     return UInt256(data=bytearray(self.ReadBytes(32)))
    #
    # def ReadUInt160(self):
    #     """
    #     Read a UInt160 value from the stream.
    #
    #     Returns:
    #         UInt160:
    #     """
    #     return UInt160(data=bytearray(self.ReadBytes(20)))
    #
    # def Read2000256List(self):
    #     """
    #     Read 2000 times a 64 byte value from the stream.
    #
    #     Returns:
    #         list: a list containing 2000 64 byte values in reversed form.
    #     """
    #     items = []
    #     for i in range(0, 2000):
    #         data = self.ReadBytes(64)
    #         ba = bytearray(binascii.unhexlify(data))
    #         ba.reverse()
    #         items.append(ba.hex().encode('utf-8'))
    #     return items

    def ReadHashes(self):
        """
        Read Hash values from the stream.

        Returns:
            list: a list of hash values. Each value is of the bytearray type.
        """
        len = self.ReadVarInt()
        items = []
        for i in range(0, len):
            ba = bytearray(self.ReadBytes(32))
            ba.reverse()
            items.append(ba.hex())
        return items
    #
    # def ReadFixed8(self):
    #     """
    #     Read a Fixed8 value.
    #
    #     Returns:
    #         neocore.Fixed8
    #     """
    #     fval = self.ReadInt64()
    #     return Fixed8(fval)