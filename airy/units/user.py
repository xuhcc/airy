import logging

from sqlalchemy.sql import func

from airy.utils.date import tz_now, day_beginning, week_beginning
from airy.database import db
from airy.models import Task, TimeEntry
from airy import settings
from airy.serializers import UserSerializer
from airy.forms import LoginForm
from airy.exceptions import UserError

logger = logging.getLogger(__name__)


class User(object):

    def __init__(self):
        self.name = settings.username

    @classmethod
    def login(cls, session, data):
        form = LoginForm.from_json(data)
        if form.validate() and form.password.data == settings.password:
            session['user'] = settings.username
            return cls().serialize()
        raise UserError('Incorrect password')

    @property
    def open_tasks(self):
        query = db.session.query(Task).filter(Task.status == "open")
        return query.count()

    @property
    def total_today(self):
        now = tz_now()
        query = db.session.query(func.sum(TimeEntry.amount)).\
            filter(TimeEntry.added >= day_beginning(now))
        return query.scalar() or 0

    @property
    def total_week(self):
        now = tz_now()
        query = db.session.query(func.sum(TimeEntry.amount)).\
            filter(TimeEntry.added >= week_beginning(now))
        return query.scalar() or 0

    def serialize(self):
        return UserSerializer(self).data
