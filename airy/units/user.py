import logging

import arrow
from sqlalchemy.sql import func
from sqlalchemy import between

from airy.utils.date import tz_now
from airy.database import db
from airy.models import Task, TimeEntry
from airy import settings
from airy.serializers import UserSerializer
from airy.exceptions import UserError

logger = logging.getLogger(__name__)


class User(object):

    def __init__(self):
        self.name = settings.username

    @classmethod
    def login(cls, session, data):
        if data.get('password') == settings.password:
            session['user'] = settings.username
            return cls().serialize()
        raise UserError('Incorrect password', 400)

    @property
    def open_tasks(self):
        query = db.session.query(Task).filter(Task.status == "open")
        return query.count()

    @property
    def total_today(self):
        day_beg = arrow.get(tz_now()).floor('day').datetime
        day_end = arrow.get(day_beg).ceil('day').datetime
        query = db.session.query(func.sum(TimeEntry.duration)).\
            filter(between(TimeEntry.added_at, day_beg, day_end))
        return query.scalar()

    @property
    def total_week(self):
        week_beg = arrow.get(tz_now()).floor('week').datetime
        week_end = arrow.get(week_beg).ceil('week').datetime
        query = db.session.query(func.sum(TimeEntry.duration)).\
            filter(between(TimeEntry.added_at, week_beg, week_end))
        return query.scalar()

    def serialize(self):
        return UserSerializer().dump(self).data
