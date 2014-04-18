from sqlalchemy.sql import exists

from airy.models import Client
from airy.core import db_session as db


class ClientError(Exception):

    def __init__(self, message, code=500):
        self.message = message
        self.code = code


def get(client_id):
    client = db.query(Client).get(client_id)
    if not client:
        raise ClientError("Client #{0} not found".format(client_id), 404)
    return client


def get_all():
    clients = db.query(Client).all()
    return clients


def save(client_data):
    client = Client(**client_data)
    name_query = db.query(Client).filter(
        Client.name == client.name,
        Client.id != client.id)
    if db.query(name_query.exists()).scalar():
        raise ClientError("Client {0} already exists".format(client.name))
    if (
        client.id is not None
        and not db.query(Client).get(client.id)
    ):
        raise ClientError("Client #{0} not found".format(client.id))
    client = db.merge(client)
    db.commit()
    return client


def delete(client_id):
    client = db.query(Client).get(client_id)
    if not client:
        raise ClientError("Client #{0} not found".format(client_id))
    db.delete(client)
    db.commit()
