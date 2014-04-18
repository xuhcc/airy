from airy.models import Client, Project
from airy.core import db_session as db


class ProjectError(Exception):

    def __init__(self, message, code=500):
        self.message = message
        self.code = code


def get(project_id):
    project = db.query(Project).get(project_id)
    if not project:
        raise ProjectError("Project #{0} not found".format(project_id), 404)
    return project


def save(project_data):
    try:
        project_data['client_id'] = int(project_data['client_id'])
    except ValueError:
        raise ProjectError("Invalid client id")
    project = Project(**project_data)
    if not db.query(Client).get(project.client_id):
        raise ProjectError("Invalid client id")
    if (
        project.id is not None
        and not db.query(Project).get(project.id)
    ):
        raise ProjectError("Project #{0} not found".format(project.id))
    project = db.merge(project)
    db.commit()
    return project


def delete(project_id):
    project = db.query(Project).get(project_id)
    if not project:
        raise ProjectError("Project #{0} not found".format(project_id), 404)
    db.delete(project)
    db.commit()
