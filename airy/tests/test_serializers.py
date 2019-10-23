import pytest
from marshmallow import ValidationError

from airy.serializers import (
    ClientSerializer,
    ProjectSerializer,
    TaskSerializer,
    TimeEntrySerializer)

from factories import (
    ClientFactory,
    ProjectFactory,
    TaskFactory,
    TimeEntryFactory)


@pytest.mark.usefixtures('db_class')
class TestClientSerializer():

    def test_serialization(self):
        client = ClientFactory.create()
        project = ProjectFactory.create(client=client)
        self.db.session.commit()
        serializer = ClientSerializer()
        data = serializer.dump(client)
        assert data['id'] == client.id
        assert data['name'] == client.name
        assert data['contacts'] == client.contacts
        project_data = data['projects'][0]
        assert project_data['id'] == project.id
        assert project_data['name'] == project.name
        assert project_data['client_id'] == client.id
        assert 'tasks' not in project_data

    def test_create(self):
        data = ClientFactory.stub().__dict__
        serializer = ClientSerializer(exclude=['projects'])
        instance = serializer.load(data)
        assert instance.name == data['name']
        assert instance.id is None

    def test_update(self):
        client = ClientFactory.create()
        self.db.session.commit()
        data = ClientFactory.stub().__dict__
        data['id'] = client.id
        serializer = ClientSerializer(exclude=['projects'])
        instance = serializer.load(data)
        assert instance.name == data['name']
        assert instance.id == client.id

    def test_required(self):
        serializer = ClientSerializer(exclude=['projects'])
        with pytest.raises(ValidationError) as exc_info:
            serializer.load({})

        errors = exc_info.value.messages
        assert 'name' in errors

    def test_validate_name_unique(self):
        client = ClientFactory.create()
        self.db.session.commit()

        data = ClientFactory.stub(name=client.name).__dict__
        serializer = ClientSerializer(exclude=['projects'])
        with pytest.raises(ValidationError) as exc_info:
            serializer.load(data)

        errors = exc_info.value.messages
        assert 'name' in errors

    def test_validate_name_length(self):
        serializer = ClientSerializer(exclude=['projects'])
        # Min
        data = ClientFactory.stub(name='x').__dict__
        with pytest.raises(ValidationError) as exc_info:
            serializer.load(data)
        errors = exc_info.value.messages
        assert 'name' in errors
        # Max
        data = ClientFactory.stub(name='x' * 101).__dict__
        with pytest.raises(ValidationError) as exc_info:
            serializer.load(data)
        errors = exc_info.value.messages
        assert 'name' in errors


@pytest.mark.usefixtures('db_class')
class TestProjectSerializer():

    def test_serialization(self):
        project = ProjectFactory.create()
        self.db.session.commit()
        serializer = ProjectSerializer()
        data = serializer.dump(project)
        assert data['id'] == project.id
        assert data['name'] == project.name
        assert data['description'] == project.description
        assert data['last_task'] is None
        assert not data['tasks']
        assert data['client']['id'] == project.client.id

        task_1 = TaskFactory.create(project=project, status='open')
        task_2 = TaskFactory.create(project=project, status='closed')
        self.db.session.commit()

        # Last task
        data = serializer.dump(project)
        assert data['last_task'] is not None
        assert data['last_task']['id'] == task_1.id
        assert data['last_task']['title'] == task_1.title
        assert 'time_entries' not in data['last_task']

        # Tasks (with filtering)
        data = ProjectSerializer(
            task_status='open',
        ).dump(project)
        assert len(data['tasks']) == 1
        assert data['tasks'][0]['id'] == task_1.id
        assert data['tasks'][0]['project_id'] == project.id
        data = ProjectSerializer(task_status='closed').dump(project)
        assert len(data['tasks']) == 1
        assert data['tasks'][0]['id'] == task_2.id
        assert data['tasks'][0]['project_id'] == project.id

    def test_create(self):
        client = ClientFactory.create()
        self.db.session.commit()
        data = ProjectFactory.stub(client=None).__dict__
        data['client_id'] = client.id
        del data['client']
        serializer = ProjectSerializer(
            only=['id', 'name', 'description', 'client_id'])
        instance = serializer.load(data)
        assert instance.id is None
        assert instance.name == data['name']
        assert instance.client_id == client.id

    def test_update(self):
        project = ProjectFactory.create()
        self.db.session.commit()
        data = ProjectFactory.stub(client=None).__dict__
        data['id'] = project.id
        data['client_id'] = project.client.id
        del data['client']
        serializer = ProjectSerializer(
            only=['id', 'name', 'description', 'client_id'])
        instance = serializer.load(data)
        assert instance.id == project.id
        assert instance.name == data['name']
        assert instance.client_id == project.client.id

    def test_required(self):
        serializer = ProjectSerializer(
            only=['id', 'name', 'description', 'client_id'])
        with pytest.raises(ValidationError) as exc_info:
            serializer.load({})

        errors = exc_info.value.messages
        assert 'name' in errors
        assert 'client_id' in errors

    def test_validate_client_id(self):
        data = ProjectFactory.stub(client=None).__dict__
        data['client_id'] = 0
        serializer = ProjectSerializer(
            only=['id', 'name', 'description', 'client_id'])
        with pytest.raises(ValidationError) as exc_info:
            serializer.load(data)

        errors = exc_info.value.messages
        assert 'client_id' in errors

    def test_validate_name_length(self):
        serializer = ProjectSerializer(
            only=['id', 'name', 'description', 'client_id'])
        # Min
        data = ProjectFactory.stub(name='x').__dict__
        with pytest.raises(ValidationError) as exc_info:
            serializer.load(data)
        errors = exc_info.value.messages
        assert 'name' in errors
        # Max
        data = ProjectFactory.stub(name='x' * 101).__dict__
        with pytest.raises(ValidationError) as exc_info:
            serializer.load(data)
        errors = exc_info.value.messages
        assert 'name' in errors


@pytest.mark.usefixtures('db_class')
class TestTaskSerializer():

    def test_serialization(self):
        task = TaskFactory.create()
        time_entry = TimeEntryFactory.create(task=task)
        self.db.session.commit()
        serializer = TaskSerializer()
        data = serializer.dump(task)
        assert data['id'] == task.id
        assert data['title'] == task.title
        assert data['url'] == task.url
        assert data['description'] == task.description
        assert data['project_id'] == task.project.id
        assert data['total_time'] == time_entry.duration.total_seconds()
        assert data['is_closed'] is False
        time_data = data['time_entries'][0]
        assert time_data['id'] == time_entry.id
        assert time_data['comment'] == time_entry.comment
        assert time_data['task_id'] == task.id
        assert 'task_total_time' not in time_data

    def test_create(self):
        project = ProjectFactory.create()
        self.db.session.commit()
        data = TaskFactory.stub(project=None).__dict__
        data['project_id'] = project.id
        del data['project']
        del data['created_at']
        del data['updated_at']
        serializer = TaskSerializer(
            only=['id', 'title', 'url', 'description', 'project_id'])
        instance = serializer.load(data)
        assert instance.id is None
        assert instance.title == data['title']
        assert instance.url == data['url']
        assert instance.project_id == project.id
        assert instance.created_at is not None
        assert instance.updated_at is not None

    def test_update(self):
        task = TaskFactory.create()
        self.db.session.commit()
        data = TaskFactory.stub(project=None).__dict__
        data['id'] = task.id
        data['project_id'] = task.project.id
        del data['project']
        del data['created_at']
        del data['updated_at']
        serializer = TaskSerializer(
            only=['id', 'title', 'url', 'description', 'project_id'])
        instance = serializer.load(data)
        assert instance.id == task.id
        assert instance.title == data['title']
        assert instance.project_id == task.project.id

    def test_required(self):
        serializer = TaskSerializer(
            only=['id', 'title', 'url', 'description', 'project_id'])
        with pytest.raises(ValidationError) as exc_info:
            serializer.load({})

        errors = exc_info.value.messages
        assert 'title' in errors
        assert 'url' not in errors
        assert 'description' not in errors
        assert 'project_id' in errors

    def test_validate_project_id(self):
        data = TaskFactory.stub(project=None).__dict__
        data['project_id'] = 0
        serializer = TaskSerializer(
            only=['id', 'title', 'description', 'project_id'])
        with pytest.raises(ValidationError) as exc_info:
            serializer.load(data)

        errors = exc_info.value.messages
        assert 'project_id' in errors

    def test_validate_title_length(self):
        serializer = TaskSerializer(
            only=['id', 'title', 'description', 'project_id'])
        # Min
        data = TaskFactory.stub(title='x').__dict__
        with pytest.raises(ValidationError) as exc_info:
            serializer.load(data)
        errors = exc_info.value.messages
        assert 'title' in errors
        # Max
        data = TaskFactory.stub(title='x' * 101).__dict__
        with pytest.raises(ValidationError) as exc_info:
            serializer.load(data)
        errors = exc_info.value.messages
        assert 'title' in errors

    def test_preprocess_url(self):
        serializer = TaskSerializer(
            only=['id', 'title', 'description', 'project_id', 'url'])
        project = ProjectFactory.create()
        self.db.session.commit()
        data = TaskFactory.stub(project=None, url='').__dict__
        data['project_id'] = project.id
        del data['project']
        del data['created_at']
        del data['updated_at']
        instance = serializer.load(data)
        assert instance.url is None


@pytest.mark.usefixtures('db_class')
class TestTimeEntrySerializer():

    def test_serialization(self):
        time_entry = TimeEntryFactory.create()
        self.db.session.commit()
        serializer = TimeEntrySerializer()
        data = serializer.dump(time_entry)
        assert data['id'] == time_entry.id
        assert data['duration'] == time_entry.duration.total_seconds()
        assert data['comment'] == time_entry.comment
        assert data['task_id'] == time_entry.task.id
        assert 'added_at' in data
        assert data['task_total_time'] == data['duration']

    def test_create(self):
        task = TaskFactory.create()
        self.db.session.commit()
        data = TimeEntryFactory.stub(task=None).__dict__
        data['task_id'] = task.id
        data['duration'] = data['duration'].total_seconds()
        del data['task']
        del data['added_at']
        serializer = TimeEntrySerializer(exclude=['added_at'])
        instance = serializer.load(data)
        assert instance.id is None
        assert instance.duration.total_seconds() == data['duration']
        assert instance.task_id == task.id
        assert instance.added_at is not None

    def test_update(self):
        time_entry = TimeEntryFactory.create()
        self.db.session.commit()
        data = TimeEntryFactory.stub(task=None).__dict__
        data['id'] = time_entry.id
        data['task_id'] = time_entry.task.id
        data['duration'] = data['duration'].total_seconds()
        del data['task']
        del data['added_at']
        serializer = TimeEntrySerializer(exclude=['added_at'])
        instance = serializer.load(data)
        assert instance.id == time_entry.id
        assert instance.duration.total_seconds() == data['duration']
        assert instance.task_id == time_entry.task.id

    def test_required(self):
        serializer = TimeEntrySerializer(exclude=['added_at'])
        with pytest.raises(ValidationError) as exc_info:
            serializer.load({})
        errors = exc_info.value.messages
        assert 'duration' in errors
        assert 'task_id' in errors

    def test_validate_task_id(self):
        data = TimeEntryFactory.stub(task=None).__dict__
        data['task_id'] = 0
        serializer = TimeEntrySerializer(exclude=['added_at'])
        with pytest.raises(ValidationError) as exc_info:
            serializer.load(data)
        errors = exc_info.value.messages
        assert 'task_id' in errors

    def test_validate_duration(self):
        task = TaskFactory.create()
        self.db.session.commit()
        data = TimeEntryFactory.stub(task=None).__dict__
        data['task_id'] = task.id
        # Min
        invalid_data = data.copy()
        invalid_data['duration'] = 30
        serializer = TimeEntrySerializer(exclude=['added_at'])
        with pytest.raises(ValidationError) as exc_info:
            serializer.load(invalid_data)
        errors = exc_info.value.messages
        assert 'duration' in errors
        # Max
        invalid_data = data.copy()
        invalid_data['duration'] = 101 * 3600
        serializer = TimeEntrySerializer(exclude=['added_at'])
        with pytest.raises(ValidationError) as exc_info:
            serializer.load(invalid_data)
        errors = exc_info.value.messages
        assert 'duration' in errors
        # Seconds
        invalid_data = data.copy()
        invalid_data['duration'] = 11111
        serializer = TimeEntrySerializer(exclude=['added_at'])
        with pytest.raises(ValidationError) as exc_info:
            serializer.load(invalid_data)
        errors = exc_info.value.messages
        assert 'duration' in errors

    def test_validate_comment_null(self):
        task = TaskFactory.create()
        self.db.session.commit()
        valid_data = TimeEntryFactory.stub(task=None, comment=None).__dict__
        valid_data['task_id'] = task.id
        valid_data['duration'] = valid_data['duration'].total_seconds()
        del valid_data['task']
        del valid_data['added_at']
        assert valid_data['comment'] is None
        serializer = TimeEntrySerializer(exclude=['added_at'])
        serializer.load(valid_data)
