import datetime
import math


def time_filter(amount):
    duration = datetime.timedelta(hours=float(amount)).total_seconds()
    hours = math.floor(duration / 3600)
    minutes = math.floor((duration - hours * 3600) / 60)
    return '{0}:{1:02d}'.format(hours, minutes)
