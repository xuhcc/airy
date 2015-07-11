import datetime
from collections import OrderedDict
import itertools

import arrow
from flask import render_template
import premailer
from sqlalchemy import between

from airy import settings
from airy.database import db
from airy.models import Client, Project, Task, TimeEntry
from airy.serializers import (
    DateRangeSerializer,
    TimeSheetSerializer,
    TaskReportSerializer)
from airy.exceptions import ClientError
from airy.utils import email


class TimeSheet(object):

    def __init__(self, client_id, date_range):
        self.client = Client.query.get(client_id)
        if not self.client:
            raise ClientError("Client #{0} not found".format(client_id), 404)
        self.date_range, errors = DateRangeSerializer().load(date_range)
        if errors:
            raise ClientError(errors, 400)

    def _build(self):
        query = db.session.\
            query(Project, Task.title, TimeEntry.added_at, TimeEntry.duration).\
            join(Project.tasks).\
            join(Task.time_entries).\
            filter(Project.client_id == self.client.id).\
            filter(between(TimeEntry.added_at, *self.date_range)).\
            order_by(Project.name.asc())

        dates = [day.date() for day in
                 arrow.Arrow.range('day', *self.date_range)]
        daily_totals = OrderedDict()
        for date in dates:
            daily_totals[date] = datetime.timedelta()
        projects = []

        for project, group in itertools.groupby(query, lambda row: row[0]):

            project_total = datetime.timedelta()
            daily_data = OrderedDict()
            for date in dates:
                daily_data[date] = {
                    'total': datetime.timedelta(),
                    'tasks': set(),
                }

            for row in group:
                task_title = row[1]
                date = row[2].date()
                duration = row[3]
                daily_data[date]['tasks'].add(task_title)
                daily_data[date]['total'] += duration
                project_total += duration
                daily_totals[date] += duration

            projects.append({
                'project': project,
                'time': list(daily_data.values()),
                'total': project_total,
            })

        timesheet = {
            'client': self.client,
            'date_range': {
                'beg': self.date_range[0],
                'end': self.date_range[1],
            },
            'projects': projects,
            'totals': {
                'time': list(daily_totals.values()),
                'total': sum(daily_totals.values(), datetime.timedelta()),
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

    def __init__(self, client_id, date_range):
        self.client = Client.query.get(client_id)
        if not self.client:
            raise ClientError('Client #{0} not found'.format(client_id), 404)
        self.date_range, errors = DateRangeSerializer().load(date_range)
        if errors:
            raise ClientError(errors, 400)

    def _build(self):

        query = db.session.\
            query(Project, Task.id, Task.title, TimeEntry.duration).\
            join(Project.tasks).\
            join(Task.time_entries).\
            filter(Project.client_id == self.client.id).\
            filter(between(TimeEntry.added_at, *self.date_range)).\
            order_by(Project.name.asc(), Task.id.asc())

        projects = []
        client_total = datetime.timedelta()

        for project, group in itertools.groupby(query, lambda row: row[0]):

            tasks = []
            project_total = datetime.timedelta()

            for task, group in itertools.groupby(group, lambda row: row[1]):
                task_total = datetime.timedelta()
                for row in group:
                    title = row[2]
                    task_total += row[3]
                tasks.append({'title': title, 'total': task_total})
                project_total += task_total

            projects.append({
                'project': project,
                'tasks': tasks,
                'total': project_total,
            })

            client_total += project_total

        report = {
            'client': self.client,
            'date_range': {
                'beg': self.date_range[0],
                'end': self.date_range[1],
            },
            'projects': projects,
            'total': client_total,
        }
        return report

    def get(self):
        serializer = TaskReportSerializer()
        return serializer.dump(self._build()).data

    def send(self):
        subject = 'Task report for {0}'.format(self.client.name)
        html = render_template('email/task_report.html', **self._build())
        email.send(subject,
                   premailer.transform(html),
                   settings.email)
