import datetime
import pytz

from airy import settings

timezone = pytz.timezone(settings.timezone)


def tz_now():
    return datetime.datetime.now(tz=timezone)
