from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy.types import Integer, String, Text

Base = declarative_base()


class Client(Base):

    __tablename__ = 'clients'

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    contacts = Column(Text)
