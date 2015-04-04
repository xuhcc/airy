from flask import Blueprint, request
from flask_restful import Resource

from airy.units import task
from airy.resources import Api
from airy.resources.user import requires_auth


class Tasks(Resource):

    def post(self):
        # Create new task
        return {'task': task.save(request.get_json())}


class Task(Resource):

    def put(self, task_id):
        # Update task
        return {'task': task.save(request.get_json(), task_id)}

    def delete(self, task_id):
        # Delete task
        task.delete(task_id)


class TaskStatus(Resource):

    def post(self, task_id):
        # Set task status
        return {'task': task.toggle_status(task_id)}


task_api_bp = Blueprint('task_api', __name__)
task_api = Api(task_api_bp, decorators=[requires_auth])
task_api.add_resource(Tasks, '/tasks')
task_api.add_resource(Task, '/tasks/<int:task_id>')
task_api.add_resource(TaskStatus, '/tasks/<int:task_id>/status',
                      endpoint='task_status')
