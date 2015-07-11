import logging

from airy.models import TimeEntry
from airy.exceptions import TimeEntryError
from airy.database import db
from airy.serializers import TimeEntrySerializer

logger = logging.getLogger(__name__)


def save(data, time_entry_id=None):
    data = data or {}
    if time_entry_id is not None:
        if not TimeEntry.query.get(time_entry_id):
            raise TimeEntryError(
                'Time entry #{0} not found'.format(time_entry_id), 404)
        data['id'] = time_entry_id
    serializer = TimeEntrySerializer(exclude='added_at')
    time_entry, errors = serializer.load(data)
    if errors:
        raise TimeEntryError(errors, 400)
    time_entry = db.session.merge(time_entry)
    db.session.commit()
    if time_entry.task.total_time:
        task_total_time = time_entry.task.total_time.total_seconds()
    else:
        task_total_time = 0
    serializer = TimeEntrySerializer(
        exclude='task_id',
        extra={'task_total_time': task_total_time},
        strict=True)
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
    return task.total_time.total_seconds() if task.total_time else 0
