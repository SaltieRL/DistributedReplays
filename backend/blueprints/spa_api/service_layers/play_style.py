from typing import Optional, List

from flask import current_app

from .player_stats import player_stat_wrapper, player_wrapper
from ..errors.errors import UserHasNoReplays


class PlayStyleChartSpokeData:
    def __init__(self, name: str, value: float, average: Optional[float] = None):
        self.name = name
        self.value = value
        if average is not None:
            self.average = average


class PlayStyleChartData:
    def __init__(self, title: str, spoke_datas: List[PlayStyleChartSpokeData]):
        self.title = title
        self.spokeData = [spoke_data.__dict__ for spoke_data in spoke_datas]

    @staticmethod
    def create_from_id(id_: str) -> List['PlayStyleChartData']:
        session = current_app.config['db']()
        game_count = player_wrapper.get_total_games(session, id_)
        if game_count == 0:
            raise UserHasNoReplays()
        averaged_stats = player_stat_wrapper.get_averaged_stats(session, id_)
        spider_charts_groups = player_stat_wrapper.get_stat_spider_charts()

        play_style_chart_datas = []
        for spider_chart_group in spider_charts_groups:
            title = spider_chart_group['title']
            spoke_datas = [
                PlayStyleChartSpokeData(name=name, value=averaged_stats[name])
                for name in spider_chart_group['group']
            ]
            play_style_chart_datas.append(PlayStyleChartData(title, spoke_datas))

        return play_style_chart_datas
