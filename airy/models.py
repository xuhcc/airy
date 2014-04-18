from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Integer, String, Text
from sqlalchemy.orm import relationship, backref

Base = declarative_base()


class Client(Base):

    __tablename__ = "clients"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    contacts = Column(Text)

    projects = relationship(
        "Project",
        lazy="joined",
        cascade="all,delete",
        backref=backref("client", lazy="joined", join_depth=2))


class Project(Base):

    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
