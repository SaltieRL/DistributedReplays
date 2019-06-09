from datetime import timedelta, datetime


def hour_rounder(t: datetime):
    # Rounds to nearest hour by adding a timedelta hour if minute >= 30
    return (t.replace(second=0, microsecond=0, minute=0, hour=t.hour)
            + timedelta(hours=t.minute//30))


def convert_to_datetime(timestamp: str):
    return datetime.datetime.fromtimestamp(int(timestamp))
