from flask_restful import Api as RestfulApi

from airy.exceptions import UnitError


class Api(RestfulApi):

    def handle_error(self, error):
        if isinstance(error, UnitError):
            data = {'error_msg': error.message}
            return self.make_response(data, error.status_code)
        return super().handle_error(error)
