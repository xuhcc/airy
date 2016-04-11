from flask.ext.sqlalchemy import SQLAlchemy

from airy import settings

db = SQLAlchemy()


def get_sqlalchemy_url(testing=False):
    db_name = settings.db_name + '_test' if testing else settings.db_name
    return 'postgresql+psycopg2://{user}:{pwd}@{host}:{port}/{name}'.format(
        host=settings.db_host,
        port=settings.db_port,
        user=settings.db_username,
        pwd=settings.db_password,
        name=db_name)
