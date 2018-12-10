from flask import request
from flask_restful import Resource

from airy.units import client, report
from airy.resources import Api
from airy.resources.user import requires_auth


class Clients(Resource):

    def get(self):
        # Return list of clients
        return {'clients': client.get_all()}

    def post(self):
        # Create new client
        return {'client': client.save(request.get_json() or {})}


class Client(Resource):

    def get(self, client_id):
        # Get client details
        return {'client': client.get(client_id)}

    def put(self, client_id):
        # Update client
        return {'client': client.save(request.get_json() or {}, client_id)}

    def delete(self, client_id):
        # Delete client
        client.delete(client_id)


class TimeSheet(Resource):

    def get(self, client_id):
        date_range = {
            'beg': request.args.get('beg'),
            'end': request.args.get('end'),
        }
        timesheet = report.TimeSheet(client_id, date_range)
        return {'timesheet': timesheet.get()}

    def post(self, client_id):
        timesheet = report.TimeSheet(client_id, request.get_json() or {})
        timesheet.send()


class Report(Resource):

    def get(self, client_id):
        # Get report
        date_range = {
            'beg': request.args.get('beg'),
            'end': request.args.get('end'),
        }
        task_report = report.TaskReport(client_id, date_range)
        return {'report': task_report.get()}

    def post(self, client_id):
        # Send report by email
        task_report = report.TaskReport(client_id, request.get_json() or {})
        task_report.send()


client_api = Api(decorators=[requires_auth])
client_api.add_resource(Clients, '/clients')
client_api.add_resource(Client, '/clients/<int:client_id>')
client_api.add_resource(TimeSheet, '/clients/<int:client_id>/timesheet')
client_api.add_resource(Report, '/clients/<int:client_id>/report')
