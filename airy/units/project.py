import logging

from airy.models import Client, Project
from airy.exceptions import ProjectError
from airy.core import db_session as db
from airy.serializers import ProjectSerializer, TaskSerializer
from airy.forms import ProjectForm

logger = logging.getLogger(__name__)


def get(project_id, task_status):
    project = db.query(Project).get(project_id)
    if not project:
        raise ProjectError("Project #{0} not found".format(project_id), 404)
    serialized_tasks = TaskSerializer(
        project.selected_tasks(closed=(task_status == 'closed')),
        many=True)
    serialized = ProjectSerializer(
        project,
        only=['id', 'name'],
        extra={'tasks': serialized_tasks.data})
    return serialized.data


def save(data, project_id=None):
    form = ProjectForm.from_json(data, id=project_id)
    if not form.validate():
        error_msg = ", ".join("{0}: {1}".format(k, v[0])
                              for k, v in form.errors.items())
        raise ProjectError(error_msg)
    project = Project()
    form.populate_obj(project)
    if not db.query(Client).get(project.client_id):
        raise ProjectError("Invalid client id", 400)
    if (
        project.id is not None
        and not db.query(Project).get(project.id)
    ):
        raise ProjectError("Project #{0} not found".format(project.id), 404)
    project = db.merge(project)
    db.commit()
    serialized = ProjectSerializer(project)
    return serialized.data


def delete(project_id):
    project = db.query(Project).get(project_id)
    if not project:
        raise ProjectError("Project #{0} not found".format(project_id), 404)
    db.delete(project)
    db.commit()
