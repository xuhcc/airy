import datetime
import arrow

import factory
from factory.alchemy import SQLAlchemyModelFactory
from factory.fuzzy import BaseFuzzyAttribute, _random

from airy import database, models
from airy.utils.date import tz_now, week_beginning


class ClientFactory(SQLAlchemyModelFactory):

    class Meta:
        model = models.Client
        sqlalchemy_session = database.db.session

    name = factory.Sequence(lambda n: 'Client {0:02d}'.format(n))
    contacts = 'Email: client@example.net'


class ProjectFactory(SQLAlchemyModelFactory):

    class Meta:
        model = models.Project
        sqlalchemy_session = database.db.session

    client = factory.SubFactory(ClientFactory)
    name = factory.Sequence(lambda n: 'Project {0:02d}'.format(n))
    description = 'Test project'


class TaskFactory(SQLAlchemyModelFactory):

    class Meta:
        model = models.Task
        sqlalchemy_session = database.db.session

    project = factory.SubFactory(ProjectFactory)
    title = factory.Sequence(lambda n: 'Task {0:02d}'.format(n))
    url = 'https://example.org'
    description = 'There is a bug'
    created_at = tz_now()
    updated_at = tz_now()


class FuzzyTimeDelta(BaseFuzzyAttribute):

    def __init__(self, low, high, precision=60, **kwargs):
        self.low = low
        self.high = high
        self.precision = precision
        super().__init__(**kwargs)

    def fuzz(self):
        seconds = int(_random.uniform(self.low.total_seconds(),
                                      self.high.total_seconds()))
        seconds -= seconds % self.precision
        return datetime.timedelta(seconds=seconds)


class TimeEntryFactory(SQLAlchemyModelFactory):

    class Meta:
        model = models.TimeEntry
        sqlalchemy_session = database.db.session

    task = factory.SubFactory(TaskFactory)
    duration = FuzzyTimeDelta(datetime.timedelta(minutes=1),
                              datetime.timedelta(hours=100))
    comment = factory.Sequence(lambda n: 'Comment {0:02d}'.format(n))
    added_at = tz_now()


class DateRangeFactory(factory.DictFactory):

    beg = week_beginning(tz_now()).isoformat()

    @factory.lazy_attribute
    def end(self):
        week_end = arrow.get(self.beg).ceil('week').datetime
        return week_end.isoformat()
