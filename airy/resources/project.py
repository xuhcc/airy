from flask import Blueprint, request
from flask_restful import Resource

from airy.units import project
from airy.resources import Api
from airy.resources.user import requires_auth


class Projects(Resource):

    def post(self):
        # Create new project
        return {'project': project.save(request.get_json())}


class Project(Resource):

    def get(self, project_id):
        # Get project details
        status = request.args.get('status')
        return {'project': project.get(project_id, status)}

    def put(self, project_id):
        # Update project
        return {'project': project.save(request.get_json(), project_id)}

    def delete(self, project_id):
        # Delete project
        project.delete(project_id)


project_api_bp = Blueprint('project_api', __name__)
project_api = Api(project_api_bp, decorators=[requires_auth])
project_api.add_resource(Projects, '/projects')
project_api.add_resource(Project, '/projects/<int:project_id>')
