import datetime

from airy.utils import date


class TestDateUtils():

    def test_tz_now(self):
        now = date.tz_now()
        assert now.tzinfo is not None

    def test_day_beginning(self):
        dt = datetime.datetime(2015, 3, 23, 20, 20, 20, tzinfo=date.timezone)
        beginning = date.day_beginning(dt)
        assert beginning.hour == 0
        assert beginning.minute == 0
        assert beginning.second == 0
        assert beginning.date() == dt.date()

    def test_week_beginning(self):
        dt = datetime.datetime(2015, 3, 24, 20, 20, 20, tzinfo=date.timezone)
        beginning = date.week_beginning(dt)
        assert beginning.hour == 0
        assert beginning.minute == 0
        assert beginning.second == 0
        assert beginning.date() == dt.date() - datetime.timedelta(days=1)
