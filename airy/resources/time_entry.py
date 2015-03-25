from flask import Blueprint, request
from flask_restful import Resource

from airy.units import time_entry
from airy.resources import Api
from airy.resources.user import requires_auth


class TimeEntries(Resource):

    def post(self):
        # Create new time entry
        return {'time_entry': time_entry.save(request.get_json())}


class TimeEntry(Resource):

    def put(self, time_entry_id):
        # Update time entry
        result = time_entry.save(request.get_json(), time_entry_id)
        return {'time_entry': result}

    def delete(self, time_entry_id):
        # Delete time entry
        return {'task_total_time': time_entry.delete(time_entry_id)}


time_entry_api_bp = Blueprint('time_entry_api', __name__)
time_entry_api = Api(time_entry_api_bp, decorators=[requires_auth])
time_entry_api.add_resource(TimeEntries, '/time_entries',
                            endpoint='time_entries')
time_entry_api.add_resource(TimeEntry, '/time_entries/<int:time_entry_id>',
                            endpoint='time_entry')
