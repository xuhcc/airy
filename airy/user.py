import logging
import datetime

from sqlalchemy.sql import func

from airy.core import db_session as db, timezone
from airy.models import Task, TimeEntry
from airy import settings

logger = logging.getLogger(__name__)


class User(object):

    def __init__(self):
        self.name = settings.username

    @property
    def open_tasks(self):
        query = db.query(Task).filter(Task.status == "open")
        return query.count()

    @property
    def total_today(self):
        beginning = datetime.datetime.now(tz=timezone).replace(
            hour=0, minute=0, second=0, microsecond=0)
        query = db.query(func.sum(TimeEntry.amount)).\
            filter(TimeEntry.added >= beginning)
        return query.scalar() or 0
