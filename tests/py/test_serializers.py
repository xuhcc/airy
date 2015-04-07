import pytest

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
        serializer = ClientSerializer(strict=True)
        data = serializer.dump(client).data
        assert data['id'] == client.id
        assert data['name'] == client.name
        assert data['contacts'] == client.contacts
        project_data = data['projects'][0]
        assert project_data['id'] == project.id
        assert project_data['name'] == project.name
        assert 'client_id' not in project_data
        assert 'tasks' not in project_data

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
        assert not data['tasks']

        task_1 = TaskFactory.create(project=project, status='open')
        task_2 = TaskFactory.create(project=project, status='closed')
        self.db.session.commit()
        data = serializer.dump(project).data
        assert data['last_task'] is not None
        assert data['last_task']['id'] == task_1.id
        assert data['last_task']['title'] == task_1.title
        assert 'time_entries' not in data['last_task']

        data = ProjectSerializer(
            strict=True, task_status='open').dump(project).data
        assert len(data['tasks']) == 1
        assert data['tasks'][0]['id'] == task_1.id
        assert 'project_id' not in data['tasks'][0]
        data = ProjectSerializer(
            strict=True, task_status='closed').dump(project).data
        assert len(data['tasks']) == 1
        assert data['tasks'][0]['id'] == task_2.id

    def test_create(self):
        client = ClientFactory.create()
        self.db.session.commit()
        data = ProjectFactory.stub(client=None).__dict__
        data['client_id'] = client.id
        serializer = ProjectSerializer(exclude=['tasks', 'last_task'])
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
        serializer = ProjectSerializer(exclude=['tasks', 'last_task'])
        instance, errors = serializer.load(data)
        assert not errors
        assert instance.id == project.id
        assert instance.name == data['name']
        assert instance.client_id == project.client.id

    def test_required(self):
        serializer = ProjectSerializer(exclude=['tasks', 'last_task'])
        instance, errors = serializer.load({})
        assert 'name' in errors
        assert 'client_id' in errors

    def test_validate_client_id(self):
        data = ProjectFactory.stub(client=None).__dict__
        data['client_id'] = 0
        serializer = ProjectSerializer(exclude=['tasks', 'last_task'])
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
        assert data['is_closed'] is False
        time_data = data['time_entries'][0]
        assert time_data['id'] == time_entry.id
        assert time_data['amount'] == str(time_entry.amount)
        assert time_data['comment'] == time_entry.comment
        assert 'task_id' not in time_data

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


@pytest.mark.usefixtures('db_class')
class TestTimeEntrySerializer():

    def test_serialization(self):
        time_entry = TimeEntryFactory.create()
        self.db.session.commit()
        serializer = TimeEntrySerializer(strict=True)
        data = serializer.dump(time_entry).data
        assert data['id'] == time_entry.id
        assert data['amount'] == str(time_entry.amount)
        assert data['comment'] == time_entry.comment
        assert data['task_id'] == time_entry.task.id
        assert 'added_at' in data

    def test_create(self):
        task = TaskFactory.create()
        self.db.session.commit()
        data = TimeEntryFactory.stub(task=None).__dict__
        data['task_id'] = task.id
        serializer = TimeEntrySerializer(exclude=['added_at'])
        instance, errors = serializer.load(data)
        assert not errors
        assert instance.id is None
        assert instance.amount == data['amount']
        assert instance.task_id == task.id
        assert instance.added_at is not None

    def test_update(self):
        time_entry = TimeEntryFactory.create()
        self.db.session.commit()
        data = TimeEntryFactory.stub(task=None).__dict__
        data['id'] = time_entry.id
        data['task_id'] = time_entry.task.id
        serializer = TimeEntrySerializer(exclude=['added_at'])
        instance, errors = serializer.load(data)
        assert not errors
        assert instance.id == time_entry.id
        assert instance.amount == data['amount']
        assert instance.task_id == time_entry.task.id

    def test_required(self):
        serializer = TimeEntrySerializer(exclude=['added_at'])
        instance, errors = serializer.load({})
        assert 'amount' in errors
        assert 'task_id' in errors

    def test_validate_task_id(self):
        data = TimeEntryFactory.stub(task=None).__dict__
        data['task_id'] = 0
        serializer = TimeEntrySerializer(exclude=['added_at'])
        instance, errors = serializer.load(data)
        assert 'task_id' in errors

    def test_validate_amount(self):
        task = TaskFactory.create()
        self.db.session.commit()
        data = TimeEntryFactory.stub(task=None).__dict__
        data['task_id'] = task.id
        # NaN
        invalid_data = data.copy()
        invalid_data['amount'] = 'NaN'
        serializer = TimeEntrySerializer(exclude=['added_at'])
        instance, errors = serializer.load(invalid_data)
        assert 'amount' in errors
        # Min
        invalid_data = data.copy()
        invalid_data['amount'] = '0.00'
        serializer = TimeEntrySerializer(exclude=['added_at'])
        instance, errors = serializer.load(invalid_data)
        assert 'amount' in errors
        # Max
        invalid_data = data.copy()
        invalid_data['amount'] = '1000.00'
        serializer = TimeEntrySerializer(exclude=['added_at'])
        instance, errors = serializer.load(invalid_data)
        assert 'amount' in errors
