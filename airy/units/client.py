import logging

from airy.models import Client
from airy.exceptions import ClientError
from airy.database import db
from airy.serializers import ClientSerializer, ProjectSerializer
from airy.forms import ClientForm

logger = logging.getLogger(__name__)


def get(client_id):
    client = db.session.query(Client).get(client_id)
    if not client:
        raise ClientError("Client #{0} not found".format(client_id), 404)
    serialized_projects = ProjectSerializer(many=True).\
        dump(client.projects)
    serializer = ClientSerializer(
        only=['id', 'name'],
        extra={'projects': serialized_projects.data})
    return serializer.dump(client).data


def get_all():
    clients = db.session.query(Client).all()
    serialized = ClientSerializer(many=True).dump(clients)
    return serialized.data


def save(data, client_id=None):
    form = ClientForm.from_json(data, id=client_id)
    if not form.validate():
        error_msg = ", ".join("{0}: {1}".format(k, v[0])
                              for k, v in form.errors.items())
        raise ClientError(error_msg)
    client = Client()
    form.populate_obj(client)
    name_query = db.session.query(Client).filter(
        Client.name == client.name,
        Client.id != client.id)
    if db.session.query(name_query.exists()).scalar():
        raise ClientError("Client {0} already exists".format(client.name), 400)
    if (
        client.id is not None
        and not db.session.query(Client).get(client.id)
    ):
        raise ClientError("Client #{0} not found".format(client.id), 404)
    client = db.session.merge(client)
    db.session.commit()
    serialized = ClientSerializer().dump(client)
    return serialized.data


def delete(client_id):
    client = db.session.query(Client).get(client_id)
    if not client:
        raise ClientError("Client #{0} not found".format(client_id), 404)
    db.session.delete(client)
    db.session.commit()
