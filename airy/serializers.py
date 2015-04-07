from marshmallow import Schema, fields, validate, ValidationError

from airy.database import db
from airy.models import Client, Project, Task, TimeEntry
from airy.utils.date import tz_now


class UserSerializer(Schema):

    name = fields.String()
    open_tasks = fields.Integer()
    total_today = fields.Decimal(places=2, as_string=True)
    total_week = fields.Decimal(places=2, as_string=True)

    class Meta:
        strict = True


def validate_amount(value):
    if value.is_nan():
        raise ValidationError('Amount can not be NaN')
    else:
        validate.Range(min=0.01, max=99.99)(value)


def validate_task_id(value):
    if not Task.query.get(value):
        raise ValidationError('Invalid task id.')


class TimeEntrySerializer(Schema):

    id = fields.Integer()
    amount = fields.Decimal(places=2, as_string=True, required=True,
                            validate=validate_amount)
    comment = fields.String(validate=validate.Length(max=100))
    task_id = fields.Integer(required=True,
                             validate=validate_task_id)

    added_at = fields.DateTime()

    def make_object(self, data):
        if 'id' not in data:
            data['added_at'] = tz_now()
        return TimeEntry(**data)


def validate_project_id(value):
    if not Project.query.get(value):
        raise ValidationError('Invalid project id.')


class TaskSerializer(Schema):

    id = fields.Integer()
    title = fields.String(required=True,
                          validate=validate.Length(max=100))
    description = fields.String(validate=validate.Length(max=1000))
    project_id = fields.Integer(required=True,
                                validate=validate_project_id)

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    time_entries = fields.Nested(TimeEntrySerializer,
                                 exclude=['task_id'],
                                 many=True)
    total_time = fields.Decimal(places=2, as_string=True)
    is_closed = fields.Boolean()

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
    description = fields.String(validate=validate.Length(max=700))
    client_id = fields.Integer(required=True,
                               validate=validate_client_id)

    tasks = fields.Nested(TaskSerializer,
                          exclude=['project_id'],
                          many=True)
    last_task = fields.Nested(TaskSerializer,
                              only=['id', 'title'],
                              allow_null=True)
    client = fields.Nested('ClientSerializer',
                           only=['id', 'name'])

    def __init__(self, *args, **kwargs):
        task_status = kwargs.pop('task_status', None)
        super().__init__(*args, **kwargs)
        if task_status == 'open':
            self.fields['tasks'].attribute = 'open_tasks'
        elif task_status == 'closed':
            self.fields['tasks'].attribute = 'closed_tasks'

    def make_object(self, data):
        return Project(**data)


class ClientSerializer(Schema):

    id = fields.Integer()
    name = fields.String(required=True)
    contacts = fields.String(validate=validate.Length(max=700))

    projects = fields.Nested(ProjectSerializer,
                             only=['id', 'name', 'description', 'last_task'],
                             many=True)

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


class TimeSheetSerializer(Schema):

    client = fields.Nested(ClientSerializer, only=['id', 'name'])
    week_beg = fields.Function(lambda obj: obj['week_beg'].isoformat())
    week_end = fields.Function(lambda obj: obj['week_beg'].isoformat())
    projects = fields.Method('serialize_projects')
    totals = fields.Method('serialize_totals')

    class Meta:
        strict = True

    def serialize_projects(self, obj):
        data = obj['projects'].copy()
        project_serializer = ProjectSerializer(only=['id', 'name'],
                                               strict=True)
        for row in data:
            row['project'] = project_serializer.dump(row['project']).data
            row['total'] = str(row['total'])
            for day_data in row['time']:
                day_data['amount'] = str(day_data['amount'])
                day_data['tasks'] = '\n'.join(day_data['tasks'])
        return data

    def serialize_totals(self, obj):
        totals = obj['totals'].copy()
        totals['time'] = [str(val) for val in totals['time']]
        totals['total'] = str(totals['total'])
        return totals


class TaskReportSerializer(Schema):

    project = fields.Nested(ProjectSerializer,
                            only=['id', 'name', 'client'])
    week_beg = fields.Function(lambda obj: obj['week_beg'].isoformat())
    week_end = fields.Function(lambda obj: obj['week_beg'].isoformat())
    tasks = fields.Method('serialize_tasks')
    total = fields.Decimal(places=2, as_string=True)

    class Meta:
        strict = True

    def serialize_tasks(self, obj):
        data = obj['tasks'].copy()
        for row in data:
            row['amount'] = str(row['amount'])
        return data
