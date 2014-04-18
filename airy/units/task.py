import datetime

import pytz

from airy.models import Project, Task
from airy.core import db_session as db, timezone


class TaskError(Exception):

    def __init__(self, message, code=500):
        self.message = message
        self.code = code


def save(task_data):
    try:
        task_data['project_id'] = int(task_data['project_id'])
    except ValueError:
        raise TaskError("Invalid project id")
    task = Task(**task_data)
    task.updated = datetime.datetime.now(tz=timezone)
    if task.id is None:
        task.created = task.updated
    if not db.query(Project).get(task.project_id):
        raise TaskError("Invalid project id")
    if (
        task.id is not None
        and not db.query(Task).get(task.id)
    ):
        raise TaskError("Task #{0} not found".format(task.id))
    task = db.merge(task)
    db.commit()
    return task


def delete(task_id):
    task = db.query(Project).get(task_id)
    if not task:
        raise TaskError("Task #{0} not found".format(task_id), 404)
    db.delete(task)
    db.commit()
