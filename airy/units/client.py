from sqlalchemy.sql import exists

from airy.models import Client
from airy.core import db_session


class ClientError(Exception):

    def __init__(self, message):
        self.message = message


def get(client_id):
    with db_session() as session:
        client = session.query(Client).get(client_id)
        if not client:
            raise ClientError("Client #{0} not found".format(client_id))
    return client


def get_all():
    with db_session() as session:
        clients = session.query(Client).all()
    return clients


def save(client_data):
    client = Client(**client_data)
    with db_session() as session:
        name_query = session.query(Client).filter(
            Client.name == client.name,
            Client.id != client.id)
        if session.query(name_query.exists()).scalar():
            raise ClientError("Client {0} already exists".format(client.name))
        if (
            client.id is not None
            and not session.query(Client).get(client.id)
        ):
            raise ClientError("Client #{0} not found".format(client.id))
        client = session.merge(client)
    return client


def delete(client_id):
    with db_session() as session:
        client = session.query(Client).get(client_id)
        if not client:
            raise ClientError("Client #{0} not found".format(client_id))
        session.delete(client)
