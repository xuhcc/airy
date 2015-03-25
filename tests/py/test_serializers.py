import pytest

from airy.serializers import (
    ClientSerializer,
    ProjectSerializer,
    TaskSerializer)

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
        serializer = ClientSerializer(strict=True)
        data = serializer.dump(client).data
        assert data['id'] == client.id
        assert data['name'] == client.name
        assert data['contacts'] == client.contacts
        project_data = data['projects'][0]
        assert project_data['id'] == project.id
        assert project_data['name'] == project.name
        assert 'last_task' not in project_data

    def test_create(self):
        data = ClientFactory.stub().__dict__
        serializer = ClientSerializer(exclude=['projects'])
        instance, errors = serializer.load(data)
        assert not errors
        assert instance.name == data['name']
        assert instance.id is None

    def test_update(self):
        client = ClientFactory.create()
        self.db.session.commit()
        data = ClientFactory.stub().__dict__
        data['id'] = client.id
        serializer = ClientSerializer(exclude=['projects'])
        instance, errors = serializer.load(data)
        assert not errors
        assert instance.name == data['name']
        assert instance.id == client.id

    def test_required(self):
        serializer = ClientSerializer(exclude=['projects'])
        instance, errors = serializer.load({})
        assert 'name' in errors

    def test_unique_name(self):
        client = ClientFactory.create()
        self.db.session.commit()

        data = ClientFactory.stub(name=client.name).__dict__
        serializer = ClientSerializer(exclude=['projects'])
        instance, errors = serializer.load(data)
        assert 'name' in errors


@pytest.mark.usefixtures('db_class')
class TestProjectSerializer():

    def test_serialization(self):
        project = ProjectFactory.create()
        self.db.session.commit()
        serializer = ProjectSerializer(strict=True)
        data = serializer.dump(project).data
        assert data['id'] == project.id
        assert data['name'] == project.name
        assert data['description'] == project.description
        assert data['last_task'] is None

        task = TaskFactory.create(project=project)
        self.db.session.commit()
        data = serializer.dump(project).data
        assert data['last_task'] is not None
        assert data['last_task']['id'] == task.id
        assert data['last_task']['title'] == task.title
        assert 'time_entries' not in data['last_task']

    def test_create(self):
        client = ClientFactory.create()
        self.db.session.commit()
        data = ProjectFactory.stub(client=None).__dict__
        data['client_id'] = client.id
        serializer = ProjectSerializer(exclude=['last_task'])
        instance, errors = serializer.load(data)
        assert not errors
        assert instance.id is None
        assert instance.name == data['name']
        assert instance.client_id == client.id

    def test_update(self):
        project = ProjectFactory.create()
        self.db.session.commit()
        data = ProjectFactory.stub(client=None).__dict__
        data['id'] = project.id
        data['client_id'] = project.client.id
        serializer = ProjectSerializer(exclude=['last_task'])
        instance, errors = serializer.load(data)
        assert not errors
        assert instance.id == project.id
        assert instance.name == data['name']
        assert instance.client_id == project.client.id

    def test_required(self):
        serializer = ProjectSerializer(exclude=['last_task'])
        instance, errors = serializer.load({})
        assert 'name' in errors
        assert 'client_id' in errors

    def test_validate_client_id(self):
        data = ProjectFactory.stub(client=None).__dict__
        data['client_id'] = 0
        serializer = ProjectSerializer(exclude=['last_task'])
        instance, errors = serializer.load(data)
        assert 'client_id' in errors


@pytest.mark.usefixtures('db_class')
class TestTaskSerializer():

    def test_serialization(self):
        task = TaskFactory.create()
        time_entry = TimeEntryFactory.create(task=task)
        self.db.session.commit()
        serializer = TaskSerializer(strict=True)
        data = serializer.dump(task).data
        assert data['id'] == task.id
        assert data['title'] == task.title
        assert data['description'] == task.description
        assert data['project_id'] == task.project.id
        assert data['total_time'] == str(time_entry.amount)
        time_data = data['time_entries'][0]
        assert time_data['id'] == time_entry.id
        assert time_data['amount'] == str(time_entry.amount)
        assert time_data['comment'] == time_entry.comment

    def test_create(self):
        project = ProjectFactory.create()
        self.db.session.commit()
        data = TaskFactory.stub(project=None).__dict__
        data['project_id'] = project.id
        serializer = TaskSerializer(
            only=['id', 'title', 'description', 'project_id'])
        instance, errors = serializer.load(data)
        assert not errors
        assert instance.id is None
        assert instance.title == data['title']
        assert instance.project_id == project.id
        assert instance.created_at is not None
        assert instance.updated_at is not None

    def test_update(self):
        task = TaskFactory.create()
        self.db.session.commit()
        data = TaskFactory.stub(project=None).__dict__
        data['id'] = task.id
        data['project_id'] = task.project.id
        serializer = TaskSerializer(
            only=['id', 'title', 'description', 'project_id'])
        instance, errors = serializer.load(data)
        assert not errors
        assert instance.id == task.id
        assert instance.title == data['title']
        assert instance.project_id == task.project.id

    def test_required(self):
        serializer = TaskSerializer(
            only=['id', 'title', 'description', 'project_id'])
        instance, errors = serializer.load({})
        assert 'title' in errors
        assert 'project_id' in errors

    def test_validate_project_id(self):
        data = TaskFactory.stub(project=None).__dict__
        data['project_id'] = 0
        serializer = TaskSerializer(
            only=['id', 'title', 'description', 'project_id'])
        instance, errors = serializer.load(data)
        assert 'project_id' in errors

    def test_update_status(self):
        task = TaskFactory.create()
        self.db.session.commit()
        data = {'id': task.id, 'status': 'completed'}
        serializer = TaskSerializer(only=['id', 'status'])
        instance, errors = serializer.load(data)
        assert not errors
        assert instance.id == task.id
        assert instance.status == data['status']
