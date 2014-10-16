import logging

from wtforms import Form, IntegerField, StringField, TextAreaField, validators

from airy.models import Client
from airy.exceptions import ClientError
from airy.core import db_session as db

logger = logging.getLogger(__name__)


def get(client_id):
    client = db.query(Client).get(client_id)
    if not client:
        raise ClientError("Client #{0} not found".format(client_id), 404)
    return client


def get_all():
    clients = db.query(Client).all()
    return clients


class SaveForm(Form):
    id = IntegerField("Client ID",
                      filters=[lambda val: None if val == 0 else val])
    name = StringField("Name", [
        validators.InputRequired(),
        validators.Length(max=200)])
    contacts = TextAreaField("Contacts")


def save(form):
    if not form.validate():
        error_msg = ", ".join("{0}: {1}".format(k, v[0])
                              for k, v in form.errors.items())
        raise ClientError(error_msg)
    client = Client()
    form.populate_obj(client)
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
