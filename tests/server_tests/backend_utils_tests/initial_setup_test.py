import re

from backend.initial_setup import CalculatedServer


class Test_initial_setup:
    def test_get_version(self):
        # git needs to be in the environment for this
        assert re.compile(r"[0-9a-fA-F]{7}").match(
            CalculatedServer.get_version()
        )
