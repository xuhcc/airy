import pytest
from flask import url_for

from airy import settings
from airy.utils.date import tz_now, week_beginning
from factories import (
    ClientFactory,
    ProjectFactory,
    TaskFactory,
    TimeEntryFactory,
    DateRangeFactory)


@pytest.fixture()
def login(client):
    login_url = url_for('user_api.login')
    client.post(login_url,
                json={'password': settings.password})


@pytest.mark.usefixtures('client_class', 'db_class', 'login')
class TestClientApi():

    def test_create_client(self):
        url = url_for('client_api.clients')
        client_data = {'name': 'Test Client'}
        response = self.client.post(url, json=client_data)
        assert response.status_code == 200
        assert 'client' in response.json
        assert response.json['client']['name'] == client_data['name']

    def test_list_clients(self):
        url = url_for('client_api.clients')
        response = self.client.get(url)
        assert response.status_code == 200
        assert 'clients' in response.json
        assert len(response.json['clients']) == 0

        ClientFactory.create_batch(3)
        response = self.client.get(url)
        assert len(response.json['clients']) == 3

        self.client.get(url_for('user_api.logout'))
        response = self.client.get(url)
        assert response.status_code == 403

    def test_get_client(self):
        client = ClientFactory.create()
        self.db.session.commit()

        url = url_for('client_api.client', client_id=client.id)
        response = self.client.get(url)
        assert response.status_code == 200
        assert 'client' in response.json
        assert response.json['client']['name'] == client.name

        url = url_for('client_api.client', client_id=0)
        response = self.client.get(url)
        assert response.status_code == 404

    def test_update_client(self):
        client = ClientFactory.create(name='Old Name')
        self.db.session.commit()

        url = url_for('client_api.client', client_id=client.id)
        client_data = {'name': 'New Name'}
        response = self.client.put(url, json=client_data)
        assert response.status_code == 200
        assert 'client' in response.json
        assert response.json['client']['name'] == client_data['name']

        response = self.client.put(url, json={})
        assert response.status_code == 400

    def test_delete_client(self):
        client = ClientFactory.create()
        self.db.session.commit()

        url = url_for('client_api.client', client_id=client.id)
        response = self.client.delete(url)
        assert response.status_code == 200

        response = self.client.delete(url)
        assert response.status_code == 404

    def test_get_timesheet(self):
        client = ClientFactory.create()
        date_range = DateRangeFactory.create()
        self.db.session.commit()

        url = url_for('client_api.timesheet', client_id=client.id)

        response = self.client.get(url)
        assert response.status_code == 400

        response = self.client.get(url, query_string=date_range)
        assert response.status_code == 200
        assert 'timesheet' in response.json
        client_data = response.json['timesheet']['client']
        assert client_data['name'] == client.name
        range_data = response.json['timesheet']['date_range']
        assert range_data['beg'] == date_range['beg']
        assert range_data['end'] == date_range['end']

    def test_send_timesheet(self, mocker):
        client = ClientFactory.create()
        date_range = DateRangeFactory.create()
        self.db.session.commit()

        url = url_for('client_api.timesheet', client_id=client.id)
        send_mock = mocker.patch('airy.utils.email.send')

        response = self.client.post(url)
        assert response.status_code == 400

        response = self.client.post(url, json=date_range)
        assert response.status_code == 200
        assert send_mock.call_count == 1
        args = send_mock.call_args[0]
        assert client.name in args[0]  # Subject
        assert args[2] == settings.email

    def test_get_report(self):
        week_beg = week_beginning(tz_now())
        date_range = DateRangeFactory.create(beg=week_beg.isoformat())
        client = ClientFactory.create()
        time_entry = TimeEntryFactory.create(task__project__client=client,
                                             added_at=week_beg)
        self.db.session.commit()

        url = url_for('client_api.report', client_id=client.id)
        response = self.client.get(url, query_string=date_range)
        assert response.status_code == 200
        assert 'report' in response.json
        report = response.json['report']
        assert report['client']['id'] == client.id
        assert len(report['projects']) == 1
        assert report['total'] == time_entry.duration.total_seconds()

        url = url_for('client_api.report', client_id=0)
        response = self.client.get(url)
        assert response.status_code == 404

    def test_send_report(self, mocker):
        date_range = DateRangeFactory.create()
        client = ClientFactory.create()
        self.db.session.commit()

        url = url_for('client_api.report', client_id=client.id)
        send_mock = mocker.patch('airy.utils.email.send')

        response = self.client.post(url)
        assert response.status_code == 400

        response = self.client.post(url, json=date_range)
        assert response.status_code == 200
        assert send_mock.call_count == 1
        args = send_mock.call_args[0]
        assert client.name in args[0]  # Subject
        assert args[2] == settings.email


@pytest.mark.usefixtures('client_class', 'db_class', 'login')
class TestProjectApi():

    def test_create_project(self):
        client = ClientFactory.create()
        self.db.session.commit()

        url = url_for('project_api.projects')
        project_data = {
            'client_id': client.id,
            'name': 'Test Project',
        }
        response = self.client.post(url, json=project_data)
        assert response.status_code == 200
        assert 'project' in response.json
        assert response.json['project']['name'] == project_data['name']

    def test_get_project(self):
        project = ProjectFactory.create()
        task_1 = TaskFactory.create(project=project, status='open')
        task_2 = TaskFactory.create(project=project, status='closed')
        self.db.session.commit()

        url = url_for('project_api.project', project_id=project.id)
        response = self.client.get(url, query_string={'status': 'open'})
        assert response.status_code == 200
        assert 'project' in response.json
        assert response.json['project']['name'] == project.name
        tasks = response.json['project']['tasks']
        assert len(tasks) == 1
        assert tasks[0]['id'] == task_1.id

        response = self.client.get(url, query_string={'status': 'closed'})
        assert response.status_code == 200
        tasks = response.json['project']['tasks']
        assert len(tasks) == 1
        assert tasks[0]['id'] == task_2.id

        response = self.client.get(url)
        assert response.status_code == 400

        url = url_for('project_api.project', project_id=0)
        response = self.client.get(url)
        assert response.status_code == 404

    def test_update_project(self):
        project = ProjectFactory.create(name='Old Name')
        self.db.session.commit()

        url = url_for('project_api.project', project_id=project.id)
        project_data = {
            'client_id': project.client_id,
            'name': 'New Name',
        }
        response = self.client.put(url, json=project_data)
        assert response.status_code == 200
        assert 'project' in response.json
        assert response.json['project']['name'] == project_data['name']

    def test_delete_project(self):
        project = ProjectFactory.create()
        self.db.session.commit()

        url = url_for('project_api.project', project_id=project.id)
        response = self.client.delete(url)
        assert response.status_code == 200

        response = self.client.delete(url)
        assert response.status_code == 404


@pytest.mark.usefixtures('client_class', 'db_class', 'login')
class TestTaskApi():

    def test_create_task(self):
        project = ProjectFactory.create()
        self.db.session.commit()

        url = url_for('task_api.tasks')
        task_data = {
            'project_id': project.id,
            'title': 'Test Task',
        }
        response = self.client.post(url, json=task_data)
        assert response.status_code == 200
        assert 'task' in response.json
        assert response.json['task']['project_id'] == task_data['project_id']
        assert response.json['task']['title'] == task_data['title']

    def test_update_task(self):
        task = TaskFactory.create(title='Old Title')
        self.db.session.commit()

        url = url_for('task_api.task', task_id=task.id)
        task_data = {
            'project_id': task.project_id,
            'title': 'New Title',
        }
        response = self.client.put(url, json=task_data)
        assert response.status_code == 200
        assert 'task' in response.json
        assert response.json['task']['title'] == task_data['title']

        url = url_for('task_api.task', task_id=0)
        response = self.client.put(url, json=task_data)
        assert response.status_code == 404

    def test_delete_task(self):
        task = TaskFactory.create()
        self.db.session.commit()

        url = url_for('task_api.task', task_id=task.id)
        response = self.client.delete(url)
        assert response.status_code == 200

        response = self.client.delete(url)
        assert response.status_code == 404

    def test_toggle_task_status(self):
        task = TaskFactory.create()
        self.db.session.commit()
        assert task.is_closed is False

        url = url_for('task_api.task_status', task_id=task.id)
        response = self.client.post(url)
        assert response.status_code == 200
        assert response.json['task']['is_closed'] is True

        url = url_for('task_api.task_status', task_id=0)
        response = self.client.post(url)
        assert response.status_code == 404


@pytest.mark.usefixtures('client_class', 'db_class', 'login')
class TestTimeEntryApi():

    def test_create_time_entry(self):
        task = TaskFactory.create()
        self.db.session.commit()

        url = url_for('time_entry_api.time_entries')
        time_entry_data = {
            'task_id': task.id,
            'duration': 5400,
        }
        response = self.client.post(url, json=time_entry_data)
        assert response.status_code == 200
        assert 'time_entry' in response.json
        assert (response.json['time_entry']['task_id'] ==
                time_entry_data['task_id'])
        assert (response.json['time_entry']['duration'] ==
                time_entry_data['duration'])

    def test_update_time_entry(self):
        time_entry = TimeEntryFactory.create()
        self.db.session.commit()

        url = url_for('time_entry_api.time_entry', time_entry_id=time_entry.id)
        time_entry_data = {
            'task_id': time_entry.task_id,
            'duration': 2160,
        }
        response = self.client.put(url, json=time_entry_data)
        assert response.status_code == 200
        assert 'time_entry' in response.json
        assert (response.json['time_entry']['duration'] ==
                time_entry_data['duration'])

        url = url_for('time_entry_api.time_entry', time_entry_id=0)
        response = self.client.put(url, json=time_entry_data)
        assert response.status_code == 404

    def test_delete_time_entry(self):
        time_entry = TimeEntryFactory.create()
        self.db.session.commit()

        url = url_for('time_entry_api.time_entry', time_entry_id=time_entry.id)
        response = self.client.delete(url)
        assert response.status_code == 200

        response = self.client.delete(url)
        assert response.status_code == 404
