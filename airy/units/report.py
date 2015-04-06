from collections import OrderedDict
from decimal import Decimal
import itertools

import arrow
from flask import render_template
import premailer
from sqlalchemy.sql import func
from sqlalchemy import between

from airy import settings
from airy.database import db
from airy.models import Client, Project, Task, TimeEntry
from airy.serializers import TimeSheetSerializer, TaskReportSerializer
from airy.exceptions import ClientError, ProjectError
from airy.utils import email


class TimeSheet(object):

    def __init__(self, client_id, week_beg_str):
        self.client = Client.query.get(client_id)
        if not self.client:
            raise ClientError("Client #{0} not found".format(client_id), 404)
        if not week_beg_str:
            raise ClientError('Invalid date', 400)
        try:
            self.week_beg = arrow.get(week_beg_str).floor('week').datetime
        except arrow.parser.ParserError:
            raise ClientError('Invalid date', 400)
        self.week_end = arrow.get(self.week_beg).ceil('week').datetime

    def _build(self):
        query = db.session.\
            query(Project, Task.title, TimeEntry.added_at, TimeEntry.amount).\
            join(Project.tasks).\
            join(Task.time_entries).\
            filter(Project.client_id == self.client.id).\
            filter(between(TimeEntry.added_at, self.week_beg, self.week_end)).\
            order_by(Project.name.asc())

        dates = [day.date() for day in
                 arrow.Arrow.range('day', self.week_beg, self.week_end)]
        daily_totals = OrderedDict()
        for date in dates:
            daily_totals[date] = Decimal('0.00')
        projects = []

        for project, group in itertools.groupby(query, lambda row: row[0]):

            project_total = Decimal('0.00')
            daily_data = OrderedDict()
            for date in dates:
                daily_data[date] = {
                    'amount': Decimal('0.00'),
                    'tasks': set(),
                }

            for row in group:
                task_title = row[1]
                date = row[2].date()
                amount = row[3]
                daily_data[date]['tasks'].add(task_title)
                daily_data[date]['amount'] += amount
                project_total += amount
                daily_totals[date] += amount

            projects.append({
                'project': project,
                'time': list(daily_data.values()),
                'total': project_total,
            })

        timesheet = {
            'client': self.client,
            'week_beg': self.week_beg,
            'week_end': self.week_end,
            'projects': projects,
            'totals': {
                'time': list(daily_totals.values()),
                'total': sum(daily_totals.values()),
            },
        }
        return timesheet

    def get(self):
        serializer = TimeSheetSerializer()
        return serializer.dump(self._build()).data

    def send(self):
        subject = 'Timesheet for {0}'.format(self.client.name)
        html = render_template('email/timesheet.html', **self._build())
        email.send(subject,
                   premailer.transform(html),
                   settings.email)


class TaskReport(object):

    def __init__(self, project_id, week_beg_str):
        self.project = Project.query.get(project_id)
        if not self.project:
            raise ProjectError(
                'Project #{0} not found'.format(project_id), 404)
        if not week_beg_str:
            raise ProjectError('Invalid date', 400)
        try:
            self.week_beg = arrow.get(week_beg_str).floor('week').datetime
        except arrow.parser.ParserError:
            raise ProjectError('Invalid date', 400)
        self.week_end = arrow.get(self.week_beg).ceil('week').datetime

    def _build(self):

        query = db.session.\
            query(Task.title, func.sum(TimeEntry.amount)).\
            join(Task.time_entries).\
            filter(Task.project_id == self.project.id).\
            filter(between(TimeEntry.added_at, self.week_beg, self.week_end)).\
            group_by(Task.id)

        tasks = []
        project_total = Decimal('0.00')

        for row in query:
            tasks.append({'title': row[0], 'amount': row[1]})
            project_total += row[1]

        report = {
            'project': self.project,
            'week_beg': self.week_beg,
            'week_end': self.week_end,
            'tasks': tasks,
            'total': project_total,
        }
        return report

    def get(self):
        serializer = TaskReportSerializer()
        return serializer.dump(self._build()).data
