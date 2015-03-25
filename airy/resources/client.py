from flask import request
from flask_restful import Api, Resource

from airy.units import client, report
from airy.views import requires_auth, web
from airy.exceptions import UnitError


class CustomApi(Api):

    def handle_error(self, error):
        if isinstance(error, UnitError):
            data = {'error_msg': error.message}
            return self.make_response(data, error.status_code)
        return super().handle_error(error)


class Clients(Resource):

    def get(self):
        # Return list of clients
        return {'clients': client.get_all()}

    def post(self):
        # Create new client
        return {'client': client.save(request.get_json())}


class Client(Resource):

    def get(self, client_id):
        # Get client details
        return {'client': client.get(client_id)}

    def put(self, client_id):
        # Update client
        return {'client': client.save(request.get_json(), client_id)}

    def delete(self, client_id):
        # Delete client
        client.delete(client_id)


class TimeSheet(Resource):

    def get(self, client_id):
        return {'timesheet': report.get_timesheet(client_id)}


client_api = CustomApi(web, decorators=[requires_auth])
client_api.add_resource(Clients, '/clients')
client_api.add_resource(Client, '/clients/<int:client_id>')
client_api.add_resource(TimeSheet, '/clients/<int:client_id>/timesheet')
