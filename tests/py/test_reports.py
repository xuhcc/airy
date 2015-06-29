import datetime
from decimal import Decimal
import arrow
import pytest

from airy.utils.date import tz_now, week_beginning
from airy.units.report import TimeSheet, TaskReport
from airy.serializers import DateRangeSerializer
from factories import (
    ClientFactory,
    TimeEntryFactory,
    DateRangeFactory)


class TestDateRangeSerializer():

    def test_serialization(self):
        week_beg = week_beginning(tz_now())
        week_end = arrow.get(week_beg).ceil('week').datetime
        date_range = {
            'beg': week_beg,
            'end': week_end,
        }
        serializer = DateRangeSerializer(strict=True)
        data = serializer.dump(date_range).data
        date_range = serializer.load(data).data
        assert date_range == (week_beg, week_end)

    def test_required(self):
        serializer = DateRangeSerializer()
        date_range, errors = serializer.load({})
        assert 'beg' in errors
        assert 'end' in errors

    def test_validate(self):
        serializer = DateRangeSerializer()
        data = {
            'beg': '2015-04-13T00:00:00+04:00',
            'end': '2015-04-19T00:00:00+03:00',
        }
        date_range, errors = serializer.load(data)
        assert 'beg' in errors
        assert 'end' in errors


@pytest.mark.usefixtures('db_class')
class TestTimeSheet(object):

    def test_init(self):
        date_range = DateRangeFactory.create()
        client = ClientFactory.create()
        self.db.session.commit()

        timesheet = TimeSheet(client.id, date_range)
        assert timesheet.client.id == client.id
        assert len(timesheet.date_range) == 2

    def test_get(self):
        week_beg = week_beginning(tz_now())
        date_range = DateRangeFactory(beg=week_beg.isoformat())
        client = ClientFactory.create()
        time_entries = []
        for day in range(7):
            time_entries.append(TimeEntryFactory.create(
                task__project__client=client,
                added_at=week_beg + datetime.timedelta(days=day)))
        self.db.session.commit()

        timesheet = TimeSheet(client.id, date_range)
        result = timesheet.get()

        assert result['client']['name'] == client.name
        assert result['date_range']['beg'] == week_beg.isoformat()
        assert len(result['projects']) == 7

        total_1 = sum(item.amount for item in time_entries)
        total_2 = sum(Decimal(project['total'])
                      for project in result['projects'])
        total_3 = sum(Decimal(amount)
                      for amount in result['totals']['time'])
        total_4 = Decimal(result['totals']['total'])
        assert total_1 == total_2 == total_3 == total_4


@pytest.mark.usefixtures('db_class')
class TestTaskReport(object):

    def test_get(self):
        week_beg = week_beginning(tz_now())
        date_range = DateRangeFactory(beg=week_beg.isoformat())
        client = ClientFactory.create()
        time_entries = []
        for day in range(7):
            time_entries.append(TimeEntryFactory.create(
                task__project__client=client,
                added_at=week_beg + datetime.timedelta(days=day)))
        self.db.session.commit()

        task_report = TaskReport(client.id, date_range)
        result = task_report.get()

        assert result['client']['id'] == client.id
        assert len(result['projects']) == 7
        assert result['date_range']['beg'] == week_beg.isoformat()

        total_1 = sum(item.amount for item in time_entries)
        total_2 = sum(Decimal(row['total'])
                      for row in result['projects'])
        total_3 = Decimal(result['total'])
        assert total_1 == total_2 == total_3
