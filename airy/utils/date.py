import pytz
import arrow

from airy import settings

timezone = pytz.timezone(settings.timezone)


def tz_now():
    return arrow.now(settings.timezone).datetime


def day_beginning(dt):
    return arrow.get(dt).floor('day').datetime


def week_beginning(dt):
    return arrow.get(dt).floor('week').datetime
