import datetime

import pytest

from airy import settings
from airy.exceptions import UserError
from airy.units.user import User
from airy.utils.date import tz_now, week_beginning

from factories import (
    ClientFactory,
    TimeEntryFactory,
)


@pytest.mark.usefixtures('db_class')
class TestUser():

    def test_login_error(self):
        session = {}
        with pytest.raises(UserError):
            User.login(session, {'password': 'wrong password'})

    def test_serialization(self):
        user = User()
        week_beg = week_beginning(tz_now())
        client = ClientFactory.create()

        time_entries = []
        for day in range(7):
            time_entries.append(TimeEntryFactory.create(
                task__project__client=client,
                added_at=week_beg + datetime.timedelta(days=day)))
        self.db.session.commit()

        result = user.serialize()
        assert result['name'] == settings.USER_NAME
        assert result['open_tasks'] == 7
        total_week = sum((item.duration for item in time_entries),
                         datetime.timedelta()).total_seconds()
        assert result['total_week'] == total_week
        assert any(item.duration.total_seconds() == result['total_today']
                   for item in time_entries)
