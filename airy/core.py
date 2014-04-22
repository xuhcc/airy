import logging.config
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import pytz

from airy import settings

log_config = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'nice': {
            'format': '{asctime} {name} [{levelname}] :: {message}',
            'style': '{'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'formatter': 'nice',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'logs/airy.log',
            'level': 'WARNING',
            'formatter': 'nice',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'WARNING',
    },
}
if settings.debug:
    log_config['root']['level'] = 'DEBUG'
    log_config['root']['handlers'].append('console')
logging.config.dictConfig(log_config)

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
