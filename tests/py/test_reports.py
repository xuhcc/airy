import pytest

from airy.utils.date import tz_now, week_beginning
from airy.units.report import TimeSheet
from factories import ClientFactory, TimeEntryFactory


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
        time_entry = TimeEntryFactory.create(added_at=week_beg)
        self.db.session.commit()
        client = time_entry.task.project.client
        timesheet = TimeSheet(client.id, week_beg.isoformat())
        result = timesheet.get()

        assert result['client']['name'] == client.name
        assert result['week_beg'] == week_beg.isoformat()
        data = result['data']
        assert data[0]['time'][0]['amount'] == str(time_entry.amount)
        assert data[0]['total'] == str(time_entry.amount)
        totals = result['totals']
        assert totals['total'] == str(time_entry.amount)
