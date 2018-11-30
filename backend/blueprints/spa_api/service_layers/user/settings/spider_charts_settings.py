from backend.blueprints.spa_api.service_layers.user.settings.settings import SettingsHandler
from backend.database.objects import Settings


class SpiderChartsHandler:

    @staticmethod
    def get_spider_chart_data(user_id, session):
        if user_id is None:
            return SpiderChartsHandler.get_default_spider_charts()
        if not SettingsHandler.get_setting(user_id, "spider_use_custom", create_if_not_exists=True, default_value=False,
                                           session=session):
            return SpiderChartsHandler.get_default_spider_charts()
        result = session.query(Settings) \
            .filter(Settings.user == user_id).filter(Settings.key.startswith("spider_"))
        if result.count() > 1:
            titles: Settings = result.filter(Settings.key == "spider_titles").first().value
            groups: Settings = result.filter(Settings.key == "spider_groups").first().value
        else:
            titles, groups = SpiderChartsHandler.get_default_spider_charts()
        return titles, groups

    @staticmethod
    def create_default_settings_for_user(user_id, session):
        titles, groups = SpiderChartsHandler.get_default_spider_charts()
        result = session.query(Settings) \
            .filter(Settings.user == user_id).filter(Settings.key.startswith("spider_"))
        if result.count() < 2:
            already_exists = None
            if result.count() == 1:
                already_exists = result.first().key
            if already_exists != "spider_titles":
                titles_key = Settings.create("spider_titles", titles, user_id)
                session.add(titles_key)
            if already_exists != "spider_groups":
                groups_key = Settings.create("spider_groups", groups, user_id)
                session.add(groups_key)
            session.commit()

    @staticmethod
    def get_default_spider_charts():
        titles = [  # 'Basic',
            'Aggressiveness', 'Chemistry', 'Skill', 'Tendencies', 'Luck']
        groups = [  # ['score', 'goals', 'assists', 'saves', 'turnovers'],  # basic
            ['shots', 'possession_time', 'total_hits', 'shots/hit', 'boost_usage', 'average_speed'],  # agressive
            ['total boost efficiency', 'assists', 'passes/hit', 'total_passes', 'assists/hit'],  # chemistry
            ['turnover efficiency', 'useful/hits', 'total_aerials', 'won_turnovers', 'average_hit_distance'],
            # skill
            ['time_in_attacking_third', 'time_in_attacking_half', 'time_in_defending_half',
             'time_in_defending_third',
             'time_behind_ball', 'time_in_front_ball']]  # ,  # tendencies

        # ['luck1', 'luck2', 'luck3', 'luck4']]  # luck
        return titles, groups
