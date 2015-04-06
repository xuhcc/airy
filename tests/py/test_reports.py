import datetime
from decimal import Decimal
import pytest

from airy.utils.date import tz_now, week_beginning
from airy.units.report import TimeSheet, TaskReport
from factories import ClientFactory, ProjectFactory, TimeEntryFactory


@pytest.mark.usefixtures('db_class')
class TestTimeSheet(object):

    def test_init(self):
        week_beg = week_beginning(tz_now())
        client = ClientFactory.create()
        self.db.session.commit()

        timesheet = TimeSheet(client.id, week_beg.isoformat())
        assert timesheet.client.id == client.id
        assert timesheet.week_beg == week_beg
        assert timesheet.week_end is not None

    def test_get(self):
        week_beg = week_beginning(tz_now())
        client = ClientFactory.create()
        time_entries = []
        for day in range(7):
            time_entries.append(TimeEntryFactory.create(
                task__project__client=client,
                added_at=week_beg + datetime.timedelta(days=day)))
        self.db.session.commit()

        timesheet = TimeSheet(client.id, week_beg.isoformat())
        result = timesheet.get()

        assert result['client']['name'] == client.name
        assert result['week_beg'] == week_beg.isoformat()
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
        project = ProjectFactory.create()
        time_entries = []
        for day in range(7):
            time_entries.append(TimeEntryFactory.create(
                task__project=project,
                added_at=week_beg + datetime.timedelta(days=day)))
        self.db.session.commit()

        task_report = TaskReport(project.id, week_beg.isoformat())
        result = task_report.get()

        assert result['project']['id'] == project.id
        assert len(result['tasks']) == 7
        assert result['week_beg'] == week_beg.isoformat()

        total_1 = sum(item.amount for item in time_entries)
        total_2 = sum(Decimal(task['amount'])
                      for task in result['tasks'])
        total_3 = Decimal(result['total'])
        assert total_1 == total_2 == total_3
