import logging
import datetime

from wtforms import Form, IntegerField, DecimalField, TextAreaField, validators

from airy.models import Task, TimeEntry
from airy.core import db_session as db, timezone

logger = logging.getLogger(__name__)


class TimeEntryError(Exception):

    def __init__(self, message, code=500):
        self.message = message
        self.code = code
        logger.warning(message)


def get(time_entry_id):
    time_entry = db.query(TimeEntry).get(time_entry_id)
    if not time_entry:
        raise TimeEntryError(
            "Time entry #{0} not found".format(time_entry_id),
            404)
    return time_entry


class SaveForm(Form):
    id = IntegerField("Time entry ID",
                      filters=[lambda val: None if val == 0 else val])
    amount = DecimalField("Spent time", [
        validators.InputRequired(),
        validators.NumberRange(min=0.01, max=99.99)])
    comment = TextAreaField("Comment")
    task_id = IntegerField("Task ID", [validators.DataRequired()])


def save(form):
    if not form.validate():
        error_msg = ", ".join("{0}: {1}".format(k, v[0])
                              for k, v in form.errors.items())
        raise TimeEntryError(error_msg)
    time_entry = TimeEntry()
    form.populate_obj(time_entry)
    if time_entry.id is None:
        time_entry.added = datetime.datetime.now(tz=timezone)
    if not db.query(Task).get(time_entry.task_id):
        raise TimeEntryError("Invalid task id")
    if (
        time_entry.id is not None
        and not db.query(TimeEntry).get(time_entry.id)
    ):
        raise TimeEntryError("Time entry #{0} not found".format(time_entry.id))
    time_entry = db.merge(time_entry)
    db.commit()
    return time_entry


def delete(time_entry_id):
    time_entry = db.query(TimeEntry).get(time_entry_id)
    if not time_entry:
        raise TimeEntryError(
            "Time entry #{0} not found".format(time_entry_id),
            404)
    task = time_entry.task
    db.delete(time_entry)
    db.commit()
    return task.total_time
