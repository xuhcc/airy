import os
import sys

import pytest
from alembic.command import upgrade, stamp
from alembic.config import Config as AlembicConfig
from sqlalchemy_utils import database_exists, create_database, drop_database

sys.path.append(os.getcwd())

from airy import create_app, config, database  # noqa: E402


@pytest.yield_fixture(scope='session')
def app():
    """
    Create test database and application
    """
    app = create_app(testing=True)
    sqlalchemy_url = app.config['SQLALCHEMY_DATABASE_URI']
    if database_exists(sqlalchemy_url):
        drop_database(sqlalchemy_url)
    create_database(sqlalchemy_url)
    yield app


@pytest.yield_fixture()
def db_tables(app):
    database.db.create_all(app=app)
    yield
    database.db.session.remove()
    database.db.drop_all(app=app)


@pytest.yield_fixture(autouse=True)
def db_migrations(app):
    alembic_ini = os.path.join(config.project_dir, 'alembic.ini')
    alembic_config = AlembicConfig(alembic_ini)
    alembic_config.attributes['testing'] = True
    upgrade(alembic_config, 'head')
    yield
    database.db.session.remove()
    database.db.drop_all(app=app)
    stamp(alembic_config, 'base')


@pytest.fixture
def db_class(request):
    if request.cls is not None:
        request.cls.db = database.db
