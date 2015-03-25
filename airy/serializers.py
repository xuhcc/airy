from marshmallow import Schema, fields, validate, ValidationError

from airy.database import db
from airy.models import Client, Project, Task, TaskStatus
from airy.utils.date import tz_now


class UserSerializer(Schema):

    total_today = fields.Decimal(places=2, as_string=True)
    total_week = fields.Decimal(places=2, as_string=True)

    class Meta:
        fields = [
            'name',
            'open_tasks',
            'total_today',
            'total_week',
        ]
        strict = True


class TimeEntrySerializer(Schema):

    added_at = fields.DateTime()
    amount = fields.Decimal(places=2, as_string=True)

    class Meta:
        fields = [
            'id',
            'added_at',
            'amount',
            'comment',
            'task_id',
        ]
        strict = True


def validate_project_id(value):
    if not Project.query.get(value):
        raise ValidationError('Invalid project id.')


def validate_task_status(value):
    if value not in TaskStatus.enums:
        raise ValidationError('Not a valid choice.')


class TaskSerializer(Schema):

    id = fields.Integer()
    title = fields.String(required=True,
                          validate=validate.Length(max=100))
    status = fields.String(required=True,
                           validate=validate_task_status)
    description = fields.String(validate=validate.Length(max=200))
    project_id = fields.Integer(required=True,
                                validate=validate_project_id)

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    time_entries = fields.Nested(TimeEntrySerializer, many=True)
    total_time = fields.Decimal(places=2, as_string=True)

    class Meta:
        fields = [
            'id',
            'title',
            'status',
            'description',
            'project_id',
            'created_at',
            'updated_at',
            'time_entries',
            'total_time',
        ]

    def make_object(self, data):
        if 'id' not in data:
            data['created_at'] = tz_now()
        data['updated_at'] = tz_now()
        return Task(**data)


def validate_client_id(value):
    if not Client.query.get(value):
        raise ValidationError('Invalid client id.')


class ProjectSerializer(Schema):

    id = fields.Integer()
    name = fields.String(required=True,
                         validate=validate.Length(max=100))
    description = fields.String(validate=validate.Length(max=200))
    client_id = fields.Integer(required=True,
                               validate=validate_client_id)

    last_task = fields.Nested(TaskSerializer,
                              only=['id', 'title'],
                              allow_null=True)

    class Meta:
        fields = [
            'id',
            'name',
            'description',
            'client_id',
            'last_task',
        ]

    def make_object(self, data):
        return Project(**data)


class ClientSerializer(Schema):

    id = fields.Integer()
    name = fields.String(required=True)
    contacts = fields.String(validate=validate.Length(max=200))

    projects = fields.Nested(ProjectSerializer,
                             only=['id', 'name'],
                             many=True)

    class Meta:
        fields = [
            'id',
            'name',
            'contacts',
            'projects',
        ]

    def make_object(self, data):
        return Client(**data)


@ClientSerializer.validator
def validate_unique_client_name(schema, client):
    if client.get('name'):
        name_query = Client.query.filter(
            Client.name == client['name'],
            Client.id != client.get('id'))
        if db.session.query(name_query.exists()).scalar():
            raise ValidationError(
                'Client {0} already exists'.format(client['name']),
                'name')


class ReportSerializer(Schema):

    project = fields.Nested(ProjectSerializer, only=['id', 'name'])
    date_begin = fields.DateTime()
    date_end = fields.DateTime()
    tasks = fields.Nested(TaskSerializer,
                          only=['title', 'total_time'],
                          many=True)
    total_time = fields.Decimal(places=2, as_string=True)
    created_at = fields.DateTime()

    class Meta:
        fields = [
            'project',
            'date_begin',
            'date_end',
            'tasks',
            'created_at',
            'total_time',
        ]
        strict = True
