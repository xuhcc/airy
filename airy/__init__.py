"""
Application init
"""
from flask import Flask

from airy import settings
from airy.static import static_folder
from airy.core import db_session
from airy.webapp import web


def create_app():
    app = Flask(__name__,
                static_folder=static_folder,
                static_url_path='/static')
    app.debug = settings.debug
    app.secret_key = settings.secret_key
    app.session_cookie_name = "airy_session"

    app.register_blueprint(web)

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

    return app


def runserver():
    app = create_app()
    app.run(host=settings.http_host,
            port=settings.http_port)
