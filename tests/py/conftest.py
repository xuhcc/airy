import os
import sys

import pytest

sys.path.append(os.getcwd())

from airy import create_app, db
from airy.core import project_dir


@pytest.yield_fixture(scope='session')
def app():
    # Create test database and app
    testdb_path = os.path.join(project_dir, 'test.db')
    if os.path.exists(testdb_path):
        os.unlink(testdb_path)
    sqlalchemy_url = 'sqlite:///{0}'.format(testdb_path)
    app = create_app(test_sqlalchemy_url=sqlalchemy_url)
    yield app
    # Remove test database
    os.unlink(testdb_path)


@pytest.yield_fixture(autouse=True)
def db_tables(app):
    with app.test_request_context():
        db.create_all()
    yield
    with app.test_request_context():
        db.drop_all()
