from flask_sqlalchemy import SQLAlchemy

from airy import settings

db = SQLAlchemy()


def get_sqlalchemy_url(testing=False):
    db_name = settings.DB_NAME + '_test' if testing else settings.DB_NAME
    return 'postgresql+psycopg2://{user}:{pwd}@{host}:{port}/{name}'.format(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        user=settings.DB_USERNAME,
        pwd=settings.DB_PASSWORD,
        name=db_name)
