from flask.ext.sqlalchemy import SQLAlchemy

from airy import settings

sqlalchemy_url = 'postgresql+psycopg2://{0}:{1}@/{2}'.format(
    settings.db_username,
    settings.db_password,
    settings.db_name)

db = SQLAlchemy()
