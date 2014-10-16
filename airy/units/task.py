import logging
import datetime

from airy.models import Project, Task
from airy.exceptions import TaskError
from airy.core import db_session as db, timezone
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
    task.updated = datetime.datetime.now(tz=timezone)
    if task.id is None:
        task.created = task.updated
    if not db.query(Project).get(task.project_id):
        raise TaskError("Invalid project id", 400)
    if (
        task.id is not None
        and not db.query(Task).get(task.id)
    ):
        raise TaskError("Task #{0} not found".format(task.id), 404)
    task = db.merge(task)
    db.commit()
    serialized = TaskSerializer(task)
    return serialized.data


def set_status(data, task_id):
    form = TaskStatusForm.from_json(data, id=task_id)
    if not form.validate():
        error_msg = ", ".join("{0}: {1}".format(k, v[0])
                              for k, v in form.errors.items())
        raise TaskError(error_msg)
    task = Task()
    form.populate_obj(task)
    task.updated = datetime.datetime.now(tz=timezone)
    if not db.query(Task).get(task.id):
        raise TaskError("Task #{0} not found".format(task.id), 404)
    task = db.merge(task)
    db.commit()


def delete(task_id):
    task = db.query(Task).get(task_id)
    if not task:
        raise TaskError("Task #{0} not found".format(task_id), 404)
    db.delete(task)
    db.commit()
