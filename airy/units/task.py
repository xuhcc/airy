import datetime

from wtforms import Form, IntegerField, StringField, TextAreaField, validators

from airy.models import Project, Task
from airy.core import db_session as db, timezone


class TaskError(Exception):

    def __init__(self, message, code=500):
        self.message = message
        self.code = code


class SaveForm(Form):
    id = IntegerField("Task ID",
                      filters=[lambda val: None if val == 0 else val])
    title = StringField("Title", [validators.InputRequired()])
    description = TextAreaField("Description")
    project_id = IntegerField("Project ID", [validators.DataRequired()])


def save(form):
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
        raise TaskError("Invalid project id")
    if (
        task.id is not None
        and not db.query(Task).get(task.id)
    ):
        raise TaskError("Task #{0} not found".format(task.id))
    task = db.merge(task)
    db.commit()
    return task


class StatusForm(Form):
    id = IntegerField("Task ID")
    status = StringField("Status", [
        validators.InputRequired(),
        validators.AnyOf(["open", "completed", "closed"])])


def set_status(form):
    if not form.validate():
        error_msg = ", ".join("{0}: {1}".format(k, v[0])
                              for k, v in form.errors.items())
        raise TaskError(error_msg)
    task = Task()
    form.populate_obj(task)
    if not db.query(Task).get(task.id):
        raise TaskError("Task #{0} not found".format(task.id))
    task = db.merge(task)
    db.commit()


def delete(task_id):
    task = db.query(Task).get(task_id)
    if not task:
        raise TaskError("Task #{0} not found".format(task_id), 404)
    db.delete(task)
    db.commit()
