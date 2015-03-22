import os
import sys

import pytest

sys.path.append(os.getcwd())

from airy import create_app, db


@pytest.fixture(scope='session')
def app():
    # Create test database and app
    app = create_app(test_sqlalchemy_url='sqlite://')
    return app


@pytest.yield_fixture(autouse=True)
def db_tables(app):
    db.create_all(app=app)
    yield
    db.session.remove()
    db.drop_all(app=app)


@pytest.fixture
def db_class(request):
    if request.cls is not None:
        request.cls.db = db
