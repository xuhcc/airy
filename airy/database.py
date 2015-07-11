from flask.ext.sqlalchemy import SQLAlchemy

from airy import settings

db = SQLAlchemy()


def get_sqlalchemy_url(testing=False):
    db_name = settings.db_name + '_test' if testing else settings.db_name
    return 'postgresql+psycopg2://{0}:{1}@/{2}'.format(
        settings.db_username,
        settings.db_password,
        db_name)
