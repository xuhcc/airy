from sqlalchemy.sql import func

from airy.core import db_session as db
from airy.models import Task, TimeEntry
from airy.units import project


class Report(object):

    status = "completed"

    def __init__(self, project_id):
        self.project = project.get(project_id)
        self.tasks = db.query(Task).filter(
            Task.project_id == self.project.id,
            Task.status == self.status).\
            order_by(Task.updated.asc()).all()

    @property
    def range(self):
        if not self.tasks:
            return None
        else:
            start = self.tasks[0].updated
            end = self.tasks[-1].updated
            return (start, end)

    @property
    def time_total(self):
        """
        Returns time spent on "completed" tasks
        """
        query = db.query(func.sum(TimeEntry.amount)).\
            join(Task.time_entries).\
            filter(Task.project_id == self.project.id).\
            filter(Task.status == self.status)
        return query.scalar() or 0
