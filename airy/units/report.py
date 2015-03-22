from sqlalchemy.sql import func

from airy.utils.date import tz_now
from airy.database import db
from airy.models import Project, Task, TimeEntry, Report
from airy.serializers import ReportSerializer
from airy.exceptions import ProjectError


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
            order_by(Task.updated.asc()).all()

    @property
    def date_begin(self):
        if self.tasks:
            return self.tasks[0].updated

    @property
    def date_end(self):
        if self.tasks:
            return self.tasks[-1].updated

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
            created=tz_now(),
            total_time=self.total_time,
            project_id=self.project.id)
        db.session.add(report)
        db.session.query(Task).\
            filter(Task.project_id == self.project.id).\
            filter(Task.status == self.status).\
            update({"status": "closed"})
        db.session.commit()

    def serialize(self):
        serialized = ReportSerializer(self, exclude=['created'])
        return serialized.data


def get_all():
    reports = db.session.query(Report).\
        order_by(Report.created.asc()).\
        all()
    serialized = ReportSerializer(
        reports,
        only=['project', 'created', 'total_time'],
        many=True)
    return serialized.data
