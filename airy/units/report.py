from collections import OrderedDict
import datetime
from decimal import Decimal
import itertools

from sqlalchemy.sql import func
from sqlalchemy import between

from airy.utils.date import tz_now, week_beginning
from airy.database import db
from airy.models import Client, Project, Task, TimeEntry, Report
from airy.serializers import ReportSerializer, ProjectSerializer
from airy.exceptions import ClientError, ProjectError


class ReportManager(object):

    status = "completed"

    def __init__(self, project_id):
        self.project = db.session.query(Project).get(project_id)
        if not self.project:
            raise ProjectError("Project #{0} not found".format(project_id),
                               404)
        self.tasks = db.session.query(Task).filter(
            Task.project_id == self.project.id,
            Task.status == self.status).\
            order_by(Task.updated_at.asc()).all()

    @property
    def date_begin(self):
        if self.tasks:
            return self.tasks[0].updated_at

    @property
    def date_end(self):
        if self.tasks:
            return self.tasks[-1].updated_at

    @property
    def total_time(self):
        """
        Returns time spent on "completed" tasks
        """
        query = db.session.query(func.sum(TimeEntry.amount)).\
            join(Task.time_entries).\
            filter(Task.project_id == self.project.id).\
            filter(Task.status == self.status)
        return query.scalar() or 0

    def save(self):
        """
        Closes all completed tasks and saves report data
        """
        report = Report(
            created_at=tz_now(),
            total_time=self.total_time,
            project_id=self.project.id)
        db.session.add(report)
        db.session.query(Task).\
            filter(Task.project_id == self.project.id).\
            filter(Task.status == self.status).\
            update({"status": "closed"})
        db.session.commit()

    def serialize(self):
        serialized = ReportSerializer(exclude=['created_at']).dump(self)
        return serialized.data


def get_all():
    reports = db.session.query(Report).\
        order_by(Report.created_at.asc()).\
        all()
    serializer = ReportSerializer(
        only=['project', 'created_at', 'total_time'],
        many=True)
    return serializer.dump(reports).data


def get_timesheet(client_id):
    client = Client.query.get(client_id)
    if not client:
        raise ClientError("Client #{0} not found".format(client_id), 404)

    now = tz_now()
    week_beg = week_beginning(now)
    week_end = week_beg + datetime.timedelta(days=7)
    query = db.session.\
        query(Project, Task.title, TimeEntry.added_at, TimeEntry.amount).\
        join(Project.tasks).\
        join(Task.time_entries).\
        filter(Project.client_id == client.id).\
        filter(between(TimeEntry.added_at, week_beg, week_end)).\
        order_by(Project.name.asc())

    dates = [(week_beg + datetime.timedelta(days=weekday)).date()
             for weekday in range(7)]
    timesheet = {
        'week_beg': week_beg.isoformat(),
        'week_end': week_end.isoformat(),
        'data': [],
        'totals': {},
    }

    daily_totals = OrderedDict()
    for date in dates:
        daily_totals[date] = Decimal('0.00')

    for project, group in itertools.groupby(query, lambda row: row[0]):

        project_total = Decimal('0.00')
        daily_data = OrderedDict()
        for date in dates:
            daily_data[date] = {'amount': Decimal('0.00'), 'tasks': set()}

        for row in group:
            task_title = row[1]
            date = row[2].date()
            amount = row[3]
            daily_data[date]['tasks'].add(task_title)
            daily_data[date]['amount'] += amount
            project_total += amount
            daily_totals[date] += amount

        project_data = {
            'project': ProjectSerializer().dump(project).data,
            'time': [],
            'total': str(project_total),
        }
        for day_data in daily_data.values():
            project_data['time'].append({
                'amount': str(day_data['amount']),
                'tasks': '\n'.join(day_data['tasks']),
            })
        timesheet['data'].append(project_data)

    timesheet['totals']['time'] = [str(day_total) for day_total
                                   in daily_totals.values()]
    timesheet['totals']['total'] = str(sum(daily_totals.values()))
    return timesheet
