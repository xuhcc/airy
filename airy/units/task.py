import logging
import datetime

from wtforms import Form, IntegerField, StringField, TextAreaField, validators

from airy.models import Project, Task
from airy.exceptions import TaskError
from airy.core import db_session as db, timezone
from airy.serializers import TaskSerializer

logger = logging.getLogger(__name__)


class SaveForm(Form):
    id = IntegerField("Task ID")
    title = StringField("Title", [
        validators.InputRequired(),
        validators.Length(max=200)])
    description = TextAreaField("Description")
    project_id = IntegerField("Project ID", [validators.DataRequired()])


def save(data, task_id=None):
    form = SaveForm.from_json(data, id=task_id)
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


class StatusForm(Form):
    id = IntegerField("Task ID")
    status = StringField("Status", [
        validators.InputRequired(),
        validators.AnyOf(["open", "completed", "closed"])])


def set_status(data, task_id):
    form = StatusForm.from_json(data, id=task_id)
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
