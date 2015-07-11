import math


def time_filter(duration):
    duration = duration.total_seconds()
    hours = math.floor(duration / 3600)
    minutes = math.floor((duration - hours * 3600) / 60)
    return '{0}:{1:02d}'.format(hours, minutes)
