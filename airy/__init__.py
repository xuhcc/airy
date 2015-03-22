"""
Application init
"""
from flask import Flask

from airy import settings
from airy.static import static_folder
from airy.database import db, sqlalchemy_url
from airy.webapp import web
from airy.testing import ApiClient


def create_app(test_sqlalchemy_url=None):
    app = Flask(__name__,
                static_folder=static_folder,
                static_url_path='/static')
    app.debug = False if test_sqlalchemy_url else settings.debug
    app.secret_key = settings.secret_key
    app.session_cookie_name = 'airy_session'

    app.config['SQLALCHEMY_DATABASE_URI'] = \
        test_sqlalchemy_url or sqlalchemy_url
    app.config['SQLALCHEMY_ECHO'] = app.debug
    db.init_app(app)

    app.register_blueprint(web)

    app.test_client_class = ApiClient

    return app


def runserver():
    app = create_app()
    app.run(host=settings.http_host,
            port=settings.http_port)
