from marshmallow import Schema, fields


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


class TaskSerializer(Schema):

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
            'created_at',
            'updated_at',
            'time_entries',
            'total_time',
            'project_id',
        ]
        strict = True


class ProjectSerializer(Schema):

    last_task = fields.Nested(TaskSerializer,
                              only=['id', 'title'],
                              allow_null=True)

    class Meta:
        fields = [
            'id',
            'name',
            'description',
            'last_task',
            'client_id',
        ]
        strict = True


class ClientSerializer(Schema):

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
        strict = True


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
