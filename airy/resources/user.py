import functools

from flask import Blueprint, session, request, abort
from flask_restful import Resource

from airy import settings
from airy.units import user
from airy.resources import Api


def requires_auth(func):
    """
    Check session
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if session.get('user') != settings.USER_NAME:
            return abort(403)
        else:
            return func(*args, **kwargs)
    return wrapper


class User(Resource):

    def get(self):
        if session.get('user') == settings.USER_NAME:
            return {'user': user.User().serialize()}
        else:
            return {'user': {}}


class Login(Resource):

    def post(self):
        return {'user': user.User.login(session, request.get_json())}


class Logout(Resource):

    def get(self):
        session.pop('user', None)


user_api_bp = Blueprint('user_api', __name__)
user_api = Api(user_api_bp)
user_api.add_resource(User, '/user')
user_api.add_resource(Login, '/login')
user_api.add_resource(Logout, '/logout')
