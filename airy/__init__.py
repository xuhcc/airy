"""
Application init
"""
from flask import Flask

from airy import database, settings, config
from airy.utils.testing import ApiClient
from airy.utils import template_filters

from airy.views import base_bp, api_bp


def create_app(testing=False):
    app = Flask(__name__,
                static_folder=config.static_dir,
                static_url_path='/static')
    app.debug = False if testing else settings.DEBUG
    app.secret_key = settings.SECRET_KEY
    app.session_cookie_name = 'airy_session'

    app.config['SQLALCHEMY_DATABASE_URI'] = \
        database.get_sqlalchemy_url(testing=testing)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = app.debug
    database.db.init_app(app)

    app.register_blueprint(base_bp)
    app.register_blueprint(api_bp)

    app.test_client_class = ApiClient

    app.jinja_env.filters['time'] = template_filters.time_filter

    return app


def runserver():
    app = create_app()
    app.run(host=settings.HTTP_HOST,
            port=settings.HTTP_PORT)
