import logging

from airy.models import Client, Project
from airy.exceptions import ProjectError
from airy.database import db
from airy.serializers import ProjectSerializer, TaskSerializer
from airy.forms import ProjectForm

logger = logging.getLogger(__name__)


def get(project_id, task_status):
    project = db.session.query(Project).get(project_id)
    if not project:
        raise ProjectError("Project #{0} not found".format(project_id), 404)
    tasks = project.selected_tasks(closed=(task_status == 'closed'))
    serialized_tasks = TaskSerializer(many=True).dump(tasks)
    serializer = ProjectSerializer(
        only=['id', 'name'],
        extra={'tasks': serialized_tasks.data})
    return serializer.dump(project).data


def save(data, project_id=None):
    form = ProjectForm.from_json(data, id=project_id)
    if not form.validate():
        error_msg = ", ".join("{0}: {1}".format(k, v[0])
                              for k, v in form.errors.items())
        raise ProjectError(error_msg)
    project = Project()
    form.populate_obj(project)
    if not db.session.query(Client).get(project.client_id):
        raise ProjectError("Invalid client id", 400)
    if (
        project.id is not None
        and not db.session.query(Project).get(project.id)
    ):
        raise ProjectError("Project #{0} not found".format(project.id), 404)
    project = db.session.merge(project)
    db.session.commit()
    serialized = ProjectSerializer().dump(project)
    return serialized.data


def delete(project_id):
    project = db.session.query(Project).get(project_id)
    if not project:
        raise ProjectError("Project #{0} not found".format(project_id), 404)
    db.session.delete(project)
    db.session.commit()
