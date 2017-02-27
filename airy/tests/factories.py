import datetime
import random
import arrow

import factory
from factory.alchemy import SQLAlchemyModelFactory

from airy import database, models
from airy.utils.date import tz_now, week_beginning


class ClientFactory(SQLAlchemyModelFactory):

    class Meta:
        model = models.Client
        sqlalchemy_session = database.db.session

    name = factory.Sequence(lambda n: 'Client {0:02d}'.format(n))
    contacts = factory.Faker('text', max_nb_chars=100)


class ProjectFactory(SQLAlchemyModelFactory):

    class Meta:
        model = models.Project
        sqlalchemy_session = database.db.session

    client = factory.SubFactory(ClientFactory)
    name = factory.Sequence(lambda n: 'Project {0:02d}'.format(n))
    description = factory.Faker('text', max_nb_chars=100)


class TaskFactory(SQLAlchemyModelFactory):

    class Meta:
        model = models.Task
        sqlalchemy_session = database.db.session

    project = factory.SubFactory(ProjectFactory)
    title = factory.Sequence(lambda n: 'Task {0:02d}'.format(n))
    url = factory.Faker('url')
    description = factory.Faker('text', max_nb_chars=200)
    created_at = factory.LazyFunction(tz_now)
    updated_at = factory.LazyFunction(tz_now)


class TimeEntryFactory(SQLAlchemyModelFactory):

    class Meta:
        model = models.TimeEntry
        sqlalchemy_session = database.db.session

    task = factory.SubFactory(TaskFactory)
    comment = factory.Faker('sentence', nb_words=2)
    added_at = factory.LazyFunction(tz_now)

    @factory.lazy_attribute
    def duration(self):
        seconds = int(random.uniform(
            datetime.timedelta(minutes=1).total_seconds(),
            datetime.timedelta(hours=100).total_seconds()))
        seconds -= seconds % 60
        return datetime.timedelta(seconds=seconds)


class DateRangeFactory(factory.DictFactory):

    @factory.lazy_attribute
    def beg(self):
        return week_beginning(tz_now()).isoformat()

    @factory.lazy_attribute
    def end(self):
        week_end = arrow.get(self.beg).ceil('week').datetime
        return week_end.isoformat()
