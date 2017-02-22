from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import (
    Integer,
    String,
    Text,
    DateTime,
    Enum,
    Interval)
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
                            lazy='joined',
                            order_by='Project.name')


class Project(db.Model):

    __tablename__ = "projects"

    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)

    tasks = relationship("Task", cascade="all,delete", backref="project",
                         order_by="Task.status")

    @property
    def last_task(self):
        session = object_session(self)
        query = session.query(Task).\
            filter(Task.project_id == self.id).\
            filter(Task.status != "closed").\
            order_by(Task.updated_at.desc())
        return query.first()

    def select_tasks_by_status(self, status):
        session = object_session(self)
        query = session.query(Task).\
            filter(Task.project_id == self.id).\
            filter(Task.status == status).\
            order_by(Task.status.asc(), Task.updated_at.desc())
        return query.all()

    @property
    def open_tasks(self):
        return self.select_tasks_by_status('open')

    @property
    def closed_tasks(self):
        return self.select_tasks_by_status('closed')


TaskStatus = Enum('open', 'closed', name='status')


class Task(db.Model):

    __tablename__ = "tasks"

    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    url = Column(String, nullable=True)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(TaskStatus, nullable=False, default="open")

    time_entries = relationship('TimeEntry',
                                cascade='all,delete',
                                backref='task',
                                order_by='TimeEntry.added_at')

    @property
    def total_time(self):
        session = object_session(self)
        query = session.query(func.sum(TimeEntry.duration)).\
            filter(TimeEntry.task_id == self.id)
        return query.scalar()

    @property
    def is_closed(self):
        return (self.status == 'closed')


class TimeEntry(db.Model):

    __tablename__ = "time_entries"

    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)

    id = Column(Integer, primary_key=True)
    duration = Column(Interval, nullable=False)
    comment = Column(Text)
    added_at = Column(DateTime(timezone=True), nullable=False)
