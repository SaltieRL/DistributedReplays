import unittest

from backend.utils.braacket_connection import Braacket
from backend.utils.psyonix_api_handler import get_bot_by_steam_id, get_rank, get_empty_data


class BraacketTest(unittest.TestCase):

    def setUp(self):
        self.league = Braacket()

    def test_get_player(self):
        bot = get_bot_by_steam_id("bf0d00c49bb")
        self.assertEqual(bot, "KipjeBot")
        braacket_id = self.league.player_cache.get(bot)
        kipje_id = "B86451D3-B59C-4B1D-9F85-F7D5148D1EF0"
        self.assertEqual(braacket_id, kipje_id)
        ranking_info = self.league.get_ranking(braacket_id)
        self.assertIsNotNone(ranking_info)

    def test_get_non_existing_bot(self):
        self.assertIsNone(get_bot_by_steam_id("notABot"))
        self.assertIsNone(self.league.player_cache.get("notABot"))
        self.assertIsNone(self.league.get_ranking("notABot"))
        self.assertIsNone(get_bot_by_steam_id("bNotABotb"))

    def test_get_bot_by_steam_id_allstars(self):
        bot = get_bot_by_steam_id("bcfe70a272b")
        self.assertEqual(bot, "Allstar")
        bot = get_bot_by_steam_id("b40b")
        self.assertEqual(bot, "Allstar")

    def test_get_rank_bot(self):
        unranked_rank = get_empty_data(["bf0d00c49bb"])
        rank = get_rank("bf0d00c49bb")
        self.assertNotEqual(unranked_rank[list(unranked_rank.keys())[0]].get('10'), rank.get('10'))
        self.assertEqual(unranked_rank[list(unranked_rank.keys())[0]].get('13'), rank.get('13'))
        self.assertEqual(unranked_rank[list(unranked_rank.keys())[0]].get('11'), rank.get('11'))
