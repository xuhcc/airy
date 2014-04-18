from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import pytz

from airy import settings

sqlalchemy_url = "postgresql+psycopg2://{0}:{1}@/{2}".format(
    settings.db_username,
    settings.db_password,
    settings.db_name)

engine = create_engine(sqlalchemy_url, echo=settings.debug)
db_session = scoped_session(sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False))

timezone = pytz.timezone(settings.timezone)
