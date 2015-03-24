import logging

from airy.models import Project, Task
from airy.exceptions import TaskError
from airy.utils.date import tz_now
from airy.database import db
from airy.serializers import TaskSerializer
from airy.forms import TaskForm, TaskStatusForm

logger = logging.getLogger(__name__)


def save(data, task_id=None):
    form = TaskForm.from_json(data, id=task_id)
    if not form.validate():
        error_msg = ", ".join("{0}: {1}".format(k, v[0])
                              for k, v in form.errors.items())
        raise TaskError(error_msg)
    task = Task()
    form.populate_obj(task)
    task.updated_at = tz_now()
    if task.id is None:
        task.created_at = task.updated_at
    if not db.session.query(Project).get(task.project_id):
        raise TaskError("Invalid project id", 400)
    if (
        task.id is not None
        and not db.session.query(Task).get(task.id)
    ):
        raise TaskError("Task #{0} not found".format(task.id), 404)
    task = db.session.merge(task)
    db.session.commit()
    serialized = TaskSerializer().dump(task)
    return serialized.data


def set_status(data, task_id):
    form = TaskStatusForm.from_json(data, id=task_id)
    if not form.validate():
        error_msg = ", ".join("{0}: {1}".format(k, v[0])
                              for k, v in form.errors.items())
        raise TaskError(error_msg, 400)
    task = Task()
    form.populate_obj(task)
    task.updated_at = tz_now()
    if not db.session.query(Task).get(task.id):
        raise TaskError("Task #{0} not found".format(task.id), 404)
    task = db.session.merge(task)
    db.session.commit()
    return task.status


def delete(task_id):
    task = db.session.query(Task).get(task_id)
    if not task:
        raise TaskError("Task #{0} not found".format(task_id), 404)
    db.session.delete(task)
    db.session.commit()
