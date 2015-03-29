from flask import Blueprint, request
from flask_restful import Resource

from airy.units import project, report
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


class Reports(Resource):

    def get(self):
        # Get list of reports
        return {'reports': report.get_all()}


class Report(Resource):

    def get(self, project_id):
        # Get report
        week_beg = request.args.get('week_beg')
        return {'report': report.get_task_report(project_id, week_beg)}

    def post(self, project_id):
        # Save report
        report.ReportManager(project_id).save()


project_api_bp = Blueprint('project_api', __name__)
project_api = Api(project_api_bp, decorators=[requires_auth])
project_api.add_resource(Projects, '/projects')
project_api.add_resource(Project, '/projects/<int:project_id>')
project_api.add_resource(Reports, '/reports')
project_api.add_resource(Report, '/projects/<int:project_id>/report')
