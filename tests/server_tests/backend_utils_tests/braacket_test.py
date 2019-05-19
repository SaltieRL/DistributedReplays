from backend.utils.braacket_connection import Braacket
from backend.utils.psyonix_api_handler import get_bot_by_steam_id, get_rank, get_empty_data
from tests.utils.database_utils import initialize_db_with_replays
from tests.utils.replay_utils import clear_dir


class Test_Braacket():

    def setup_method(self, method):
        self.league = Braacket()
        self.replays = [
            'https://cdn.discordapp.com/attachments/493849514680254468/576877585896570920/ALL_STAR.replay',
            'https://cdn.discordapp.com/attachments/493849514680254468/576877550891171860/ALL_STAR_SCOUT.replay',
            'https://cdn.discordapp.com/attachments/493849514680254468/560580395276566548/SKYBOT_DRIBBLE_INFO.replay',
        ]

    def test_get_player(self):
        initialize_db_with_replays(self.replays)
        bot = get_bot_by_steam_id("b086f2d2abb")
        self.assertEqual(bot, "SkyBot")
        braacket_id = self.league.player_cache.get(bot)
        skybot_id = "54FB8C16-6FA9-4C4A-AAD5-3DB8A6AE169B"
        self.assertEqual(braacket_id, skybot_id)
        ranking_info = self.league.get_ranking(braacket_id)
        self.assertIsNotNone(ranking_info)

    def test_get_non_existing_bot(self):
        initialize_db_with_replays(self.replays)
        self.assertIsNone(get_bot_by_steam_id("notABot"))
        self.assertIsNone(self.league.player_cache.get("notABot"))
        self.assertIsNone(self.league.get_ranking("notABot"))
        self.assertIsNone(get_bot_by_steam_id("bNotABotb"))

    def test_get_bot_by_steam_id_allstars(self):
        initialize_db_with_replays(self.replays)
        bot = get_bot_by_steam_id("bcfe70a272b")
        self.assertEqual(bot, "Allstar")
        bot = get_bot_by_steam_id("b40b")
        self.assertEqual(bot, "Allstar")

    def test_get_rank_bot(self):
        initialize_db_with_replays(self.replays)
        unranked_rank = get_empty_data(["b086f2d2abb"])
        rank = get_rank("b086f2d2abb")
        self.assertNotEqual(unranked_rank[list(unranked_rank.keys())[0]].get('10'), rank.get('10'))
        self.assertEqual(unranked_rank[list(unranked_rank.keys())[0]].get('13'), rank.get('13'))
        self.assertEqual(unranked_rank[list(unranked_rank.keys())[0]].get('11'), rank.get('11'))

    def teardown_method(self) -> None:
        clear_dir()
