from collections import OrderedDict
from decimal import Decimal
import itertools

import arrow
from sqlalchemy.sql import func
from sqlalchemy import between

from airy.database import db
from airy.models import Client, Project, Task, TimeEntry
from airy.serializers import ClientSerializer, ProjectSerializer
from airy.exceptions import ClientError, ProjectError


def get_timesheet(client_id, week_beg_str):
    client = Client.query.get(client_id)
    if not client:
        raise ClientError("Client #{0} not found".format(client_id), 404)
    if not week_beg_str:
        raise ClientError('Invalid date', 400)
    try:
        week_beg = arrow.get(week_beg_str).floor('week').datetime
    except arrow.parser.ParserError:
        raise ClientError('Invalid date', 400)
    week_end = arrow.get(week_beg).ceil('week').datetime

    query = db.session.\
        query(Project, Task.title, TimeEntry.added_at, TimeEntry.amount).\
        join(Project.tasks).\
        join(Task.time_entries).\
        filter(Project.client_id == client.id).\
        filter(between(TimeEntry.added_at, week_beg, week_end)).\
        order_by(Project.name.asc())

    dates = [day.date() for day in
             arrow.Arrow.range('day', week_beg, week_end)]
    timesheet = {
        'client': ClientSerializer(
            only=['id', 'name'], strict=True).dump(client).data,
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
            'project': ProjectSerializer(
                only=['id', 'name'], strict=True).dump(project).data,
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


def get_task_report(project_id, week_beg_str):
    project = Project.query.get(project_id)
    if not project:
        raise ProjectError("Project #{0} not found".format(project_id), 404)
    if not week_beg_str:
        raise ProjectError('Invalid date', 400)
    try:
        week_beg = arrow.get(week_beg_str).floor('week').datetime
    except arrow.parser.ParserError:
        raise ProjectError('Invalid date', 400)
    week_end = arrow.get(week_beg).ceil('week').datetime

    query = db.session.\
        query(Task.title, func.sum(TimeEntry.amount)).\
        join(Task.time_entries).\
        filter(Task.project_id == project.id).\
        filter(between(TimeEntry.added_at, week_beg, week_end)).\
        group_by(Task.id)

    report = {
        'project': ProjectSerializer(
            only=['id', 'name'], strict=True).dump(project).data,
        'week_beg': week_beg.isoformat(),
        'week_end': week_end.isoformat(),
        'tasks': [],
    }
    project_total = Decimal('0.00')
    for row in query:
        report['tasks'].append({
            'title': row[0],
            'amount': str(row[1]),
        })
        project_total += row[1]
    report['total'] = str(project_total)
    return report
