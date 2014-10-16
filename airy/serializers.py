from marshmallow import Serializer, fields


class UserSerializer(Serializer):

    total_today = fields.Fixed(decimals=2)
    total_week = fields.Fixed(decimals=2)

    class Meta:
        fields = [
            'name',
            'open_tasks',
            'total_today',
            'total_week',
        ]
        strict = True


class TimeEntrySerializer(Serializer):

    added = fields.DateTime('iso')
    amount = fields.Fixed(decimals=2)

    class Meta:
        fields = [
            'id',
            'added',
            'amount',
            'comment',
            'task_id',
        ]
        strict = True


class TaskSerializer(Serializer):

    created = fields.DateTime('iso')
    updated = fields.DateTime('iso')
    time_entries = fields.Nested(TimeEntrySerializer, many=True)
    total_time = fields.Fixed(decimals=2)

    class Meta:
        fields = [
            'id',
            'title',
            'status',
            'description',
            'created',
            'updated',
            'time_entries',
            'total_time',
            'project_id',
        ]
        strict = True


class ProjectSerializer(Serializer):

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


class ClientSerializer(Serializer):

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


class ReportSerializer(Serializer):

    project = fields.Nested(ProjectSerializer, only=['id', 'name'])
    date_begin = fields.DateTime('iso')
    date_end = fields.DateTime('iso')
    tasks = fields.Nested(TaskSerializer,
                          only=['title', 'total_time'],
                          many=True)
    total_time = fields.Fixed(decimals=2)
    created = fields.DateTime('iso')

    class Meta:
        fields = [
            'project',
            'date_begin',
            'date_end',
            'tasks',
            'created',
            'total_time',
        ]
        strict = True
