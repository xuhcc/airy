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


def is_day_beginning(dt):
    dt = arrow.get(dt)
    return dt == dt.to(settings.timezone).floor('day')


def is_day_end(dt):
    dt = arrow.get(dt)
    return (dt.replace(microsecond=0) ==
            dt.to(settings.timezone).ceil('day').replace(microsecond=0))
