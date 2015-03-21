"""
Application init
"""
from flask import Flask

from airy import settings
from airy.static import static_folder
from airy.database import sqlalchemy_url, db
from airy.webapp import web


def create_app(testing=False):
    app = Flask(__name__,
                static_folder=static_folder,
                static_url_path='/static')
    app.debug = False if testing else settings.debug
    app.secret_key = settings.secret_key
    app.session_cookie_name = 'airy_session'

    app.config['SQLALCHEMY_DATABASE_URI'] = sqlalchemy_url
    app.config['SQLALCHEMY_ECHO'] = app.debug
    db.init_app(app)

    app.register_blueprint(web)

    return app


def runserver():
    app = create_app()
    app.run(host=settings.http_host,
            port=settings.http_port)
