import unittest

from sqlalchemy.exc import IntegrityError, InvalidRequestError

from backend.database.objects import Player, Tag, Game
from backend.database.startup import startup
from backend.database.wrapper.tag_wrapper import TagWrapper, DBTagNotFound

TAGS = ["salt", "pepper", "peppermint", "allspice", "cinnamon", "coriander", "basil", "holy basil", "fennel",
        "cayenne pepper", "horseradish", "ginger", "curry", "celery", "chili", "chili pepper", "dill", "fingerroot",
        "garlic", "lavender", "lemon", "lime", "paprika", "parsley", "rosemary", "thyme", "vanilla", "saffron",
        "sesame", "anise", "tabasco", "wasabi", "spearmint", "watercress", ]
TEST_USER_ID = "00000000000000001"
TEST_GAME_ID = "TEST_REPLAY"


def start_test_app_():
    # TODO start test app with !test! db
    return


def close_test_app():
    # TODO close test app
    return


class TagWrapperCreateTagTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        start_test_app_()

    @classmethod
    def tearDownClass(cls):
        close_test_app()

    def setUp(self):
        self.tag_name = TAGS[0]
        self.test_user_id = TEST_USER_ID
        engine, Session = startup()
        self.session = Session()

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is None:
            test_user = Player(platformid=self.test_user_id)
            self.session.add(test_user)

        self.session.commit()

    def tearDown(self):
        # remove tag if necessary
        try:
            tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()
        except InvalidRequestError:
            self.session.rollback()
            tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()

        if tag is not None:
            self.session.delete(tag)
            self.session.commit()

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is not None:
            self.session.delete(test_user)
            self.session.commit()

        self.session.close()

    def test_create_tag_success(self):
        TagWrapper.create_tag(self.session, self.test_user_id, self.tag_name)
        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()
        self.assertIsNotNone(tag)

    def test_create_tag_tag_already_exists(self):
        TagWrapper.create_tag(self.session, self.test_user_id, self.tag_name)
        with self.assertRaises(IntegrityError):
            TagWrapper.create_tag(self.session, self.test_user_id, self.tag_name)


class TagWrapperRemoveTagTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        start_test_app_()

    @classmethod
    def tearDownClass(cls):
        close_test_app()

    def setUp(self):
        self.tag_name = TAGS[0]
        self.test_user_id = TEST_USER_ID
        engine, Session = startup()
        self.session = Session()

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is None:
            test_user = Player(platformid=self.test_user_id)
            self.session.add(test_user)

        self.session.commit()

    def tearDown(self):
        # remove tag if necessary
        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()
        if tag is not None:
            self.session.delete(tag)
            self.session.commit()

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is not None:
            self.session.delete(test_user)
            self.session.commit()

        self.session.close()

    def test_remove_tag_success(self):
        tag = Tag(owner=self.test_user_id, name=self.tag_name)
        self.session.add(tag)
        self.session.commit()

        TagWrapper.delete_tag(self.session, self.test_user_id, self.tag_name)
        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()

        self.assertIsNone(tag)

    def test_remove_tag_tag_not_found(self):
        # make sure that this tag isn't there
        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()

        if tag is not None:
            self.session.delete(tag)
            self.session.commit()

        with self.assertRaises(DBTagNotFound):
            TagWrapper.delete_tag(self.session, self.test_user_id, self.tag_name)


class TagWrapperRenameTagTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        start_test_app_()

    @classmethod
    def tearDownClass(cls):
        close_test_app()

    def setUp(self):
        self.tag_name = TAGS[0]
        self.tag_name_new = TAGS[1]
        self.test_user_id = TEST_USER_ID
        engine, Session = startup()
        self.session = Session()

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is None:
            test_user = Player(platformid=self.test_user_id)
            self.session.add(test_user)

        self.session.commit()

    def tearDown(self):
        # remove tag if necessary
        for tag_name in [self.tag_name, self.tag_name_new]:
            try:
                tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == tag_name).first()
            except InvalidRequestError:
                self.session.rollback()
                tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == tag_name).first()
            if tag is not None:
                self.session.delete(tag)
                self.session.commit()

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is not None:
            self.session.delete(test_user)
            self.session.commit()

        self.session.close()

    def test_rename_tag_success(self):
        tag = Tag(owner=self.test_user_id, name=self.tag_name)
        self.session.add(tag)
        self.session.commit()

        TagWrapper.rename_tag(self.session, self.test_user_id, self.tag_name, self.tag_name_new)
        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name_new).first()

        self.assertIsNotNone(tag)
        self.assertEqual(tag.name, self.tag_name_new)

    def test_rename_tag_tag_not_found(self):
        # assert that tag isn't present
        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()

        if tag is not None:
            self.session.delete(tag)
            self.session.commit()

        with self.assertRaises(DBTagNotFound):
            TagWrapper.rename_tag(self.session, self.test_user_id, self.tag_name, self.tag_name_new)

        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()
        self.assertIsNone(tag)

    def test_rename_tag_name_taken(self):
        tag = Tag(owner=self.test_user_id, name=self.tag_name)
        self.session.add(tag)
        tag2 = Tag(owner=self.test_user_id, name=self.tag_name_new)
        self.session.add(tag2)
        self.session.commit()

        with self.assertRaises(IntegrityError):
            TagWrapper.rename_tag(self.session, self.test_user_id, self.tag_name, self.tag_name_new)


class TagWrapperGetTagTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        start_test_app_()

    @classmethod
    def tearDownClass(cls):
        close_test_app()

    def setUp(self):
        self.tag_name = TAGS[0]
        self.test_user_id = TEST_USER_ID
        engine, Session = startup()
        self.session = Session()

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is None:
            test_user = Player(platformid=self.test_user_id)
            self.session.add(test_user)

        self.session.commit()

    def tearDown(self):
        # remove tag if necessary
        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()
        if tag is not None:
            self.session.delete(tag)
            self.session.commit()

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is not None:
            self.session.delete(test_user)
            self.session.commit()

        self.session.close()

    def test_get_tag_success(self):
        tag = Tag(owner=self.test_user_id, name=self.tag_name)
        self.session.add(tag)
        self.session.commit()

        tag = TagWrapper.get_tag(self.session, self.test_user_id, self.tag_name)

        self.assertIsNotNone(tag)

    def test_get_tag_tag_not_found(self):
        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()

        if tag is not None:
            self.session.delete(tag)
            self.session.commit()

        with self.assertRaises(DBTagNotFound):
            TagWrapper.get_tag(self.session, self.test_user_id, self.tag_name)


class TagWrapperAddTagToGameTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        start_test_app_()

    @classmethod
    def tearDownClass(cls):
        close_test_app()

    def setUp(self):
        self.tag_name = TAGS[0]
        self.tag_name_alt = TAGS[1]
        self.test_user_id = TEST_USER_ID
        engine, Session = startup()
        self.session = Session()
        self.test_game_id = TEST_GAME_ID

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is None:
            test_user = Player(platformid=self.test_user_id)
            self.session.add(test_user)

        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()
        if tag is None:
            tag = Tag(owner=self.test_user_id, name=self.tag_name)
            self.session.add(tag)

        game = self.session.query(Game).filter(Game.hash == self.test_game_id).first()
        if game is None:
            game = Game(hash=self.test_game_id)
            self.session.add(game)

        self.session.commit()

    def tearDown(self):
        # remove tag if necessary
        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()
        if tag is not None:
            self.session.delete(tag)
            self.session.commit()

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is not None:
            self.session.delete(test_user)
            self.session.commit()

        game = self.session.query(Game).filter(Game.hash == self.test_game_id).first()
        if game is not None:
            self.session.delete(game)
            self.session.commit()

        self.session.close()

    def test_add_tag_to_replay_success(self):
        TagWrapper.add_tag_to_game(self.session, self.test_game_id, self.test_user_id, self.tag_name)
        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()
        game = self.session.query(Game).filter(Game.hash == self.test_game_id).first()
        self.assertIsNotNone(tag)
        self.assertIsNotNone(game)
        self.assertIn(tag, game.tags)

    def test_add_tag_to_replay_tag_not_found(self):
        with self.assertRaises(DBTagNotFound):
            TagWrapper.add_tag_to_game(self.session, self.test_game_id, self.test_user_id, TAGS[1])


class TagWrapperRemoveTagFromGameTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        start_test_app_()

    @classmethod
    def tearDownClass(cls):
        close_test_app()

    def setUp(self):
        self.tag_name = TAGS[0]
        self.tag_name_alt = TAGS[1]
        self.test_user_id = TEST_USER_ID
        engine, Session = startup()
        self.session = Session()
        self.test_game_id = TEST_GAME_ID

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is None:
            test_user = Player(platformid=self.test_user_id)
            self.session.add(test_user)

        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()
        if tag is None:
            tag = Tag(owner=self.test_user_id, name=self.tag_name)
            self.session.add(tag)

        game = self.session.query(Game).filter(Game.hash == self.test_game_id).first()
        if game is None:
            game = Game(hash=self.test_game_id)
            self.session.add(game)

        self.session.commit()

    def tearDown(self):
        # remove tag if necessary
        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()
        if tag is not None:
            self.session.delete(tag)
            self.session.commit()

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is not None:
            self.session.delete(test_user)
            self.session.commit()

        game = self.session.query(Game).filter(Game.hash == self.test_game_id).first()
        if game is not None:
            self.session.delete(game)
            self.session.commit()

        self.session.close()

    def test_remove_tag_from_replay_success(self):
        # a bit dirty to do it like this...
        TagWrapper.add_tag_to_game(self.session, self.test_game_id, self.test_user_id, self.tag_name)
        TagWrapper.remove_tag_from_game(self.session, self.test_game_id, self.test_user_id, self.tag_name)
        tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == self.tag_name).first()
        game = self.session.query(Game).filter(Game.hash == self.test_game_id).first()
        self.assertIsNotNone(tag)
        self.assertIsNotNone(game)
        self.assertNotIn(tag, game.tags)


class TagWrapperGetTaggedGamesTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        start_test_app_()

    @classmethod
    def tearDownClass(cls):
        close_test_app()

    def setUp(self):
        self.tag_name_alt = TAGS[1]
        self.all_tags = TAGS
        self.test_user_id = TEST_USER_ID
        engine, Session = startup()
        self.session = Session()
        self.test_game_id = TEST_GAME_ID
        self.test_game_ids = self.create_replay_names()

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is None:
            test_user = Player(platformid=self.test_user_id)
            self.session.add(test_user)

        for i in range(len(self.test_game_ids)):
            tag_name = self.all_tags[i]
            tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == tag_name).first()
            if tag is None:
                tag = Tag(owner=self.test_user_id, name=tag_name)
                self.session.add(tag)

        for game_id in self.test_game_ids:
            game = self.session.query(Game).filter(Game.hash == game_id).first()
            if game is None:
                game = Game(hash=game_id)
                self.session.add(game)

        self.session.commit()

        # add some spice to the games :>
        for i in range(len(self.test_game_ids)):
            game_id = self.test_game_ids[i]
            for j in range(len(self.test_game_ids) - i):
                TagWrapper.add_tag_to_game(self.session, game_id, self.test_user_id, self.all_tags[j])

    def tearDown(self):
        # remove tag if necessary
        for i in range(len(self.test_game_ids)):
            tag_name = self.all_tags[i]
            tag = self.session.query(Tag).filter(Tag.owner == self.test_user_id, Tag.name == tag_name).first()
            if tag is not None:
                self.session.delete(tag)

        test_user = self.session.query(Player).filter(Player.platformid == self.test_user_id).first()
        if test_user is not None:
            self.session.delete(test_user)

        for game_id in self.test_game_ids:
            game = self.session.query(Game).filter(Game.hash == game_id).first()
            if game is not None:
                self.session.delete(game)

        # the dbms should remove the GameTags along with the tags and the games
        self.session.commit()
        self.session.close()

    def test_get_tagged_games(self):
        for i in range(0, len(self.test_game_ids)):
            tags = [self.all_tags[x] for x in range(len(self.test_game_ids) - i)]
            games = TagWrapper.get_tagged_games(self.session, self.test_user_id, tags)
            for game in games:
                self.assertIn(game, [self.test_game_ids[j] for j in range(i + 1)])

    def create_replay_names(self):
        return [self.test_game_id + str(i) for i in range(0, 20)]
