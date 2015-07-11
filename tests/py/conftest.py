import os
import sys

import pytest
from sqlalchemy_utils import database_exists, create_database, drop_database

sys.path.append(os.getcwd())

from airy import create_app, database


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
    drop_database(sqlalchemy_url)


@pytest.yield_fixture(autouse=True)
def db_tables(app):
    database.db.create_all(app=app)
    yield
    database.db.session.remove()
    database.db.drop_all(app=app)


@pytest.fixture
def db_class(request):
    if request.cls is not None:
        request.cls.db = database.db
