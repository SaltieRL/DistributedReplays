import enum


class HeatMapType(str, enum.Enum):
    POSITIONING = "Positioning"
    HITS = "Hits"
    SHOTS = "Shots"
    BOOST = "Boost"
    BOOST_COLLECT = "Boost Collect"
    BOOST_SPEED = "Boost Speed"
    SLOW_SPEED = "Slow Speed"
