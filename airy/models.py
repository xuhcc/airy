from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Integer, String, Text, DateTime, Enum, Numeric
from sqlalchemy.orm import relationship, object_session
from sqlalchemy.sql import func

Base = declarative_base()


class Client(Base):

    __tablename__ = "clients"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    contacts = Column(Text)

    projects = relationship("Project", cascade="all,delete", backref="client")


class Project(Base):

    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)

    tasks = relationship("Task", cascade="all,delete", backref="project",
                         order_by="Task.status")

    @property
    def last_task(self):
        session = object_session(self)
        query = session.query(Task).\
            filter(Task.project_id == self.id).\
            filter(Task.status != "closed").\
            order_by(Task.updated.desc())
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
            order_by(Task.status.asc())
        return query.all()

Status = Enum("open", "completed", "closed", name="status")


class Task(Base):

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    created = Column(DateTime(timezone=True), nullable=False)
    updated = Column(DateTime(timezone=True), nullable=False)
    status = Column(Status, nullable=False, default="open")
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    time_entries = relationship("TimeEntry",
                                cascade="all,delete",
                                backref="task")

    @property
    def total_time(self):
        session = object_session(self)
        query = session.query(func.sum(TimeEntry.amount)).\
            filter(TimeEntry.task_id == self.id)
        return query.scalar() or 0


class TimeEntry(Base):

    __tablename__ = "times_entries"

    id = Column(Integer, primary_key=True)
    amount = Column(Numeric(4, 2), nullable=False)
    comment = Column(Text)
    added = Column(DateTime(timezone=True), nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
