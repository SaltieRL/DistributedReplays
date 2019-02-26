import io
from enum import Enum, auto
from typing import List, Optional

import pandas as pd
from flask import send_file


class ChartDataPoint:
    def __init__(self, name: str, value: float, average: Optional[float] = None):
        self.name = name
        self.value = value
        if average is not None:
            self.average = average


class ChartData:
    def __init__(self, title: str, chart_data_points: List[ChartDataPoint]):
        self.title = title
        self.chartDataPoints = [chart_data_point.__dict__ for chart_data_point in chart_data_points]


class ChartType(Enum):
    radar = auto()
    bar = auto()
    pie = auto()


class ChartSubcatagory(Enum):
    pass


class ChartStatsMetadata:
    def __init__(self, stat_name: str, type_: ChartType, subcategory: ChartSubcatagory):
        self.stat_name = stat_name
        self.type = type_.name
        self.subcategory = subcategory.name.replace('_', ' ')


def convert_to_csv(chart_data, filename='test.csv'):
    mem = io.StringIO()
    df = pd.DataFrame(columns=["Player"] + [c.title for c in chart_data])
    df["Player"] = pd.Series([c["name"] for c in chart_data[0].chartDataPoints])
    for data in chart_data:
        df[data.title] = pd.Series([c["value"] for c in data.chartDataPoints])
    df.to_csv(mem)
    csv = io.BytesIO()
    csv.write(mem.getvalue().encode())
    csv.seek(0)
    mem.close()
    return send_file(
        csv,
        as_attachment=True,
        attachment_filename=filename,
        mimetype='text/csv'
    )
