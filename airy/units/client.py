import logging

from airy.models import Client
from airy.exceptions import ClientError
from airy.database import db
from airy.serializers import ClientSerializer, ProjectSerializer

logger = logging.getLogger(__name__)


def get(client_id):
    client = db.session.query(Client).get(client_id)
    if not client:
        raise ClientError("Client #{0} not found".format(client_id), 404)
    serialized_projects = ProjectSerializer(many=True, strict=True).\
        dump(client.projects)
    serializer = ClientSerializer(
        only=['id', 'name'],
        extra={'projects': serialized_projects.data},
        strict=True)
    return serializer.dump(client).data


def get_all():
    clients = db.session.query(Client).all()
    serializer = ClientSerializer(many=True, strict=True)
    return serializer.dump(clients).data


def save(data, client_id=None):
    if client_id is not None:
        if not Client.query.get(client_id):
            raise ClientError(
                'Client #{0} not found'.format(client_id), 404)
        data['id'] = client_id
    serializer = ClientSerializer(exclude=['projects'])
    client, errors = serializer.load(data)
    if errors:
        raise ClientError(errors, 400)
    client = db.session.merge(client)
    db.session.commit()
    serialized = ClientSerializer(strict=True).dump(client)
    return serialized.data


def delete(client_id):
    client = db.session.query(Client).get(client_id)
    if not client:
        raise ClientError("Client #{0} not found".format(client_id), 404)
    db.session.delete(client)
    db.session.commit()
