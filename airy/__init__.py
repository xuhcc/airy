"""
Application init
"""
from flask import Flask

from airy import database, settings, config
from airy.utils.testing import ApiClient

from airy.views import base_bp
from airy.resources.client import client_api_bp
from airy.resources.project import project_api_bp
from airy.resources.task import task_api_bp
from airy.resources.time_entry import time_entry_api_bp
from airy.resources.user import user_api_bp


def create_app(test_sqlalchemy_url=None):
    app = Flask(__name__,
                static_folder=config.static_dir,
                static_url_path='/static')
    app.debug = False if test_sqlalchemy_url else settings.debug
    app.secret_key = settings.secret_key
    app.session_cookie_name = 'airy_session'

    app.config['SQLALCHEMY_DATABASE_URI'] = \
        test_sqlalchemy_url or database.sqlalchemy_url
    app.config['SQLALCHEMY_ECHO'] = app.debug
    database.db.init_app(app)

    app.register_blueprint(base_bp)
    app.register_blueprint(client_api_bp)
    app.register_blueprint(project_api_bp)
    app.register_blueprint(task_api_bp)
    app.register_blueprint(time_entry_api_bp)
    app.register_blueprint(user_api_bp)

    app.test_client_class = ApiClient

    return app


def runserver():
    app = create_app()
    app.run(host=settings.http_host,
            port=settings.http_port)
