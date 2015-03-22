import factory
from factory.alchemy import SQLAlchemyModelFactory
from factory.fuzzy import FuzzyDecimal

from airy import database, models
from airy.utils.date import tz_now


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
    description = 'There is a bug'
    created = tz_now()
    updated = tz_now()


class TimeEntryFactory(SQLAlchemyModelFactory):

    class Meta:
        model = models.TimeEntry
        sqlalchemy_session = database.db.session

    task = factory.SubFactory(TaskFactory)
    amount = FuzzyDecimal(0.01, 5.00)
    comment = factory.Sequence(lambda n: 'Comment {0:02d}'.format(n))
    added = tz_now()
