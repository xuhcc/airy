import logging

from airy.models import Project
from airy.exceptions import ProjectError
from airy.database import db
from airy.serializers import ProjectSerializer, TaskSerializer

logger = logging.getLogger(__name__)


def get(project_id, task_status):
    project = db.session.query(Project).get(project_id)
    if not project:
        raise ProjectError("Project #{0} not found".format(project_id), 404)
    tasks = project.selected_tasks(closed=(task_status == 'closed'))
    serialized_tasks = TaskSerializer(many=True).dump(tasks)
    serializer = ProjectSerializer(
        only=['id', 'name'],
        extra={'tasks': serialized_tasks.data},
        strict=True)
    return serializer.dump(project).data


def save(data, project_id=None):
    data = data or {}
    if project_id is not None:
        if not Project.query.get(project_id):
            raise ProjectError(
                'Project #{0} not found'.format(project_id), 404)
        data['id'] = project_id
    serializer = ProjectSerializer(exclude=['last_task'])
    project, errors = serializer.load(data)
    if errors:
        raise ProjectError(errors, 400)
    project = db.session.merge(project)
    db.session.commit()
    serializer = ProjectSerializer(strict=True)
    return serializer.dump(project).data


def delete(project_id):
    project = db.session.query(Project).get(project_id)
    if not project:
        raise ProjectError("Project #{0} not found".format(project_id), 404)
    db.session.delete(project)
    db.session.commit()
