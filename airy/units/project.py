import logging

from airy.models import Project, TaskStatus
from airy.exceptions import ProjectError
from airy.database import db
from airy.serializers import ProjectSerializer

logger = logging.getLogger(__name__)


def get(project_id, task_status):
    project = db.session.query(Project).get(project_id)
    if not project:
        raise ProjectError("Project #{0} not found".format(project_id), 404)
    if task_status not in TaskStatus.enums:
        raise ProjectError('Invalid status')
    serializer = ProjectSerializer(
        exclude='last_task',
        strict=True,
        task_status=task_status)
    return serializer.dump(project).data


def save(data, project_id=None):
    data = data or {}
    if project_id is not None:
        if not Project.query.get(project_id):
            raise ProjectError(
                'Project #{0} not found'.format(project_id), 404)
        data['id'] = project_id
    serializer = ProjectSerializer(
        only=['id', 'name', 'description', 'client_id'])
    project, errors = serializer.load(data)
    if errors:
        raise ProjectError(errors, 400)
    project = db.session.merge(project)
    db.session.commit()
    serializer = ProjectSerializer(
        only=['id', 'name', 'description', 'last_task'],
        strict=True)
    return serializer.dump(project).data


def delete(project_id):
    project = db.session.query(Project).get(project_id)
    if not project:
        raise ProjectError("Project #{0} not found".format(project_id), 404)
    db.session.delete(project)
    db.session.commit()
