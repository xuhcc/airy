import datetime
import pytz

from airy import settings

timezone = pytz.timezone(settings.timezone)


def tz_now():
    return datetime.datetime.now(tz=timezone)


def day_beginning(dt):
    return dt.replace(hour=0, minute=0, second=0, microsecond=0)


def week_beginning(dt):
    return day_beginning(dt - datetime.timedelta(days=dt.weekday()))
