from airy.models import Client, Project
from airy.core import db_session


class ProjectError(Exception):

    def __init__(self, message):
        self.message = message


def save(project_data):
    try:
        project_data['client_id'] = int(project_data['client_id'])
    except ValueError:
        raise ProjectError("Invalid client id")
    project = Project(**project_data)
    with db_session() as session:
        if not session.query(Client).get(project.client_id):
            raise ProjectError("Invalid client id")
        if (
            project.id is not None
            and not session.query(Project).get(project.id)
        ):
            raise ProjectError("Project #{0} not found".format(project.id))
        project = session.merge(project)
    return project


def delete(project_id):
    with db_session() as session:
        project = session.query(Project).get(project_id)
        if not project:
            raise ProjectError("Project #{0} not found".format(project_id))
        session.delete(project)
