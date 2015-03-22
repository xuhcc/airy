import factory
from factory.alchemy import SQLAlchemyModelFactory

from airy import database, models


class ClientFactory(SQLAlchemyModelFactory):

    class Meta:
        model = models.Client
        sqlalchemy_session = database.db.session

    name = factory.Sequence(lambda n: 'Client {0:02d}'.format(n))
    contacts = 'Email: client@example.net'
