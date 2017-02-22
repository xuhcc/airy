import logging

from airy.models import Task
from airy.exceptions import TaskError
from airy.database import db
from airy.serializers import TaskSerializer

logger = logging.getLogger(__name__)


def save(data, task_id=None):
    data = data or {}
    if task_id is not None:
        if not Task.query.get(task_id):
            raise TaskError(
                'Task #{0} not found'.format(task_id), 404)
        data['id'] = task_id
    serializer = TaskSerializer(
        only=['id', 'title', 'url', 'description', 'project_id'])
    task, errors = serializer.load(data)
    if errors:
        raise TaskError(errors, 400)
    task = db.session.merge(task)
    db.session.commit()
    serializer = TaskSerializer(strict=True)
    return serializer.dump(task).data


def toggle_status(task_id):
    task = Task.query.get(task_id)
    if not task:
        raise TaskError('Task #{0} not found'.format(task_id), 404)
    if task.status == 'open':
        task.status = 'closed'
    elif task.status == 'closed':
        task.status = 'open'
    task = db.session.merge(task)
    db.session.commit()
    serializer = TaskSerializer(only=['id', 'is_closed'], strict=True)
    return serializer.dump(task).data


def delete(task_id):
    task = db.session.query(Task).get(task_id)
    if not task:
        raise TaskError("Task #{0} not found".format(task_id), 404)
    db.session.delete(task)
    db.session.commit()
