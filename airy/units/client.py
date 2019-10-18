from marshmallow import ValidationError
from sqlalchemy import func

from airy.models import Client, Project, Task
from airy.exceptions import ClientError
from airy.database import db
from airy.serializers import ClientSerializer


def get(client_id):
    client = db.session.query(Client).get(client_id)
    if not client:
        raise ClientError("Client #{0} not found".format(client_id), 404)
    serializer = ClientSerializer()
    return serializer.dump(client)


def get_all():
    subquery = db.session.\
        query(Client.id, func.max(Task.updated_at).label('updated_at')).\
        join(Client.projects).join(Project.tasks).\
        group_by(Client.id).subquery()
    clients = Client.query.\
        outerjoin(subquery, Client.id == subquery.c.id).\
        order_by(subquery.c.updated_at.desc())
    serializer = ClientSerializer(many=True)
    return serializer.dump(clients)


def save(data, client_id=None):
    if client_id is not None:
        if not Client.query.get(client_id):
            raise ClientError(
                'Client #{0} not found'.format(client_id), 404)
        data['id'] = client_id
    serializer = ClientSerializer(exclude=['projects'])
    try:
        client = serializer.load(data)
    except ValidationError as error:
        raise ClientError(error.messages, 400)
    client = db.session.merge(client)
    db.session.commit()
    serialized = ClientSerializer().dump(client)
    return serialized


def delete(client_id):
    client = db.session.query(Client).get(client_id)
    if not client:
        raise ClientError("Client #{0} not found".format(client_id), 404)
    db.session.delete(client)
    db.session.commit()
