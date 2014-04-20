from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Integer, String, Text, DateTime, Enum
from sqlalchemy.orm import relationship, object_session

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

    def tasks_by_status(self, status):
        session = object_session(self)
        query = session.query(Task).filter(
            Task.project_id == self.id,
            Task.status == status)
        return query.all()

    @property
    def last_task(self):
        session = object_session(self)
        query = session.query(Task).\
            filter(Task.project_id == self.id).\
            order_by(Task.updated.desc())
        return query.first()

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
