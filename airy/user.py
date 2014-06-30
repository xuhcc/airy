import logging
import datetime

from sqlalchemy.sql import func
from wtforms import Form, StringField, validators

from airy.core import db_session as db, timezone
from airy.models import Task, TimeEntry
from airy import settings

logger = logging.getLogger(__name__)


def day_beginning(dt):
    return dt.replace(hour=0, minute=0, second=0, microsecond=0)


def week_beginning(dt):
    return day_beginning(dt - datetime.timedelta(days=dt.weekday()))


class User(object):

    def __init__(self):
        self.name = settings.username

    @property
    def open_tasks(self):
        query = db.query(Task).filter(Task.status == "open")
        return query.count()

    @property
    def total_today(self):
        now = datetime.datetime.now(tz=timezone)
        query = db.query(func.sum(TimeEntry.amount)).\
            filter(TimeEntry.added >= day_beginning(now))
        return query.scalar() or 0

    @property
    def total_week(self):
        now = datetime.datetime.now(tz=timezone)
        query = db.query(func.sum(TimeEntry.amount)).\
            filter(TimeEntry.added >= week_beginning(now))
        return query.scalar() or 0


class LoginForm(Form):
    password = StringField("Password",
                           [validators.InputRequired()])
