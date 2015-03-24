import logging

from airy.models import Task, TimeEntry
from airy.exceptions import TimeEntryError
from airy.utils.date import tz_now
from airy.database import db
from airy.serializers import TimeEntrySerializer
from airy.forms import TimeEntryForm

logger = logging.getLogger(__name__)


def save(data, time_entry_id=None):
    form = TimeEntryForm.from_json(data, id=time_entry_id)
    if not form.validate():
        error_msg = ", ".join("{0}: {1}".format(k, v[0])
                              for k, v in form.errors.items())
        raise TimeEntryError(error_msg)
    time_entry = TimeEntry()
    form.populate_obj(time_entry)
    if time_entry.id is None:
        time_entry.added_at = tz_now()
    if not db.session.query(Task).get(time_entry.task_id):
        raise TimeEntryError("Invalid task id", 400)
    if (
        time_entry.id is not None
        and not db.session.query(TimeEntry).get(time_entry.id)
    ):
        raise TimeEntryError(
            "Time entry #{0} not found".format(time_entry.id),
            404)
    time_entry = db.session.merge(time_entry)
    db.session.commit()
    serializer = TimeEntrySerializer(
        extra={'task_total_time': str(time_entry.task.total_time)})
    return serializer.dump(time_entry).data


def delete(time_entry_id):
    time_entry = db.session.query(TimeEntry).get(time_entry_id)
    if not time_entry:
        raise TimeEntryError(
            "Time entry #{0} not found".format(time_entry_id),
            404)
    task = time_entry.task
    db.session.delete(time_entry)
    db.session.commit()
    return str(task.total_time)
