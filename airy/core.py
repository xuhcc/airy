from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from airy import settings

sqlalchemy_url = "postgresql+psycopg2://{0}:{1}@/{2}".format(
    settings.db_username,
    settings.db_password,
    settings.db_name)

engine = create_engine(sqlalchemy_url, echo=settings.debug)
Session = sessionmaker(bind=engine, expire_on_commit=False)


@contextmanager
def db_session():
    """
    Provide a transactional scope around a series of operations.
    """
    session = Session()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()
