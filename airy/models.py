from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Integer, String, Text, DateTime, Enum, Numeric
from sqlalchemy.orm import relationship, object_session
from sqlalchemy.sql import func

from airy.database import db


class Client(db.Model):

    __tablename__ = "clients"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    contacts = Column(Text)

    projects = relationship('Project',
                            cascade='all,delete',
                            backref='client',
                            lazy='joined')


class Project(db.Model):

    __tablename__ = "projects"

    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)

    tasks = relationship("Task", cascade="all,delete", backref="project",
                         order_by="Task.status")

    reports = relationship('Report', cascade='all,delete', backref='project')

    @property
    def last_task(self):
        session = object_session(self)
        query = session.query(Task).\
            filter(Task.project_id == self.id).\
            filter(Task.status != "closed").\
            order_by(Task.updated_at.desc())
        return query.first()

    def selected_tasks(self, closed):
        session = object_session(self)
        if closed:
            status_condition = (Task.status == "closed")
        else:
            status_condition = (Task.status != "closed")
        query = session.query(Task).\
            filter(Task.project_id == self.id).\
            filter(status_condition).\
            order_by(Task.status.asc(), Task.updated_at.desc())
        return query.all()

TaskStatus = Enum("open", "completed", "closed", name="status")


class Task(db.Model):

    __tablename__ = "tasks"

    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(TaskStatus, nullable=False, default="open")

    time_entries = relationship("TimeEntry",
                                cascade="all,delete",
                                backref="task")

    @property
    def total_time(self):
        session = object_session(self)
        query = session.query(func.sum(TimeEntry.amount)).\
            filter(TimeEntry.task_id == self.id)
        return query.scalar() or 0


class TimeEntry(db.Model):

    __tablename__ = "time_entries"

    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)

    id = Column(Integer, primary_key=True)
    amount = Column(Numeric(4, 2), nullable=False)
    comment = Column(Text)
    added_at = Column(DateTime(timezone=True), nullable=False)


class Report(db.Model):

    __tablename__ = "reports"

    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime(timezone=True), nullable=False)
    total_time = Column(Numeric(6, 2), nullable=False)
