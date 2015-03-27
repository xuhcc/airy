import pytest
from flask import url_for

from airy import settings
from airy.utils.date import tz_now, week_beginning
from factories import (
    ClientFactory,
    ProjectFactory,
    TaskFactory,
    TimeEntryFactory)


@pytest.fixture(scope='module')
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

    def test_timesheet(self):
        week_beg = week_beginning(tz_now())
        time_entry = TimeEntryFactory.create(added_at=week_beg)
        self.db.session.commit()
        client = time_entry.task.project.client

        url = url_for('client_api.timesheet', client_id=client.id)

        response = self.client.get(url)
        assert response.status_code == 400

        response = self.client.get(url, query_string={
            'week_beg': week_beg.isoformat()})
        assert response.status_code == 200
        assert 'timesheet' in response.json
        client_data = response.json['timesheet']['client']
        assert client_data['name'] == client.name
        assert response.json['timesheet']['week_beg'] == week_beg.isoformat()

        data = response.json['timesheet']['data']
        assert data[0]['time'][0]['amount'] == str(time_entry.amount)
        assert data[0]['total'] == str(time_entry.amount)
        totals = response.json['timesheet']['totals']
        assert totals['total'] == str(time_entry.amount)


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
        self.db.session.commit()

        url = url_for('project_api.project', project_id=project.id)
        response = self.client.get(url)
        assert response.status_code == 200
        assert 'project' in response.json
        assert response.json['project']['name'] == project.name
        assert 'tasks' in response.json['project']

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

    def test_get_report(self):
        project = ProjectFactory.create()
        tasks = TaskFactory.create_batch(
            3, project=project, status='completed')
        time_entry = TimeEntryFactory.create(task=tasks[0], amount='2.00')
        self.db.session.commit()

        url = url_for('project_api.report', project_id=project.id)
        response = self.client.get(url)
        assert response.status_code == 200
        assert 'report' in response.json
        report = response.json['report']
        assert report['project']['id'] == project.id
        assert len(report['tasks']) == 3
        assert report['total_time'] == str(time_entry.amount)

        url = url_for('project_api.report', project_id=0)
        response = self.client.get(url)
        assert response.status_code == 404

    def test_save_report(self):
        project = ProjectFactory.create()
        TaskFactory.create_batch(3, project=project, status='completed')
        self.db.session.commit()

        url = url_for('project_api.report', project_id=project.id)
        response = self.client.post(url)
        assert response.status_code == 200

    def test_list_reports(self):
        ProjectFactory.create()
        self.db.session.commit()

        url = url_for('project_api.reports')
        response = self.client.get(url)
        assert response.status_code == 200
        assert 'reports' in response.json


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

    def test_set_task_status(self):
        task = TaskFactory.create(title='Old Title')
        self.db.session.commit()
        assert task.status == 'open'

        url = url_for('task_api.task_status', task_id=task.id)
        task_data = {'status': 'completed'}
        response = self.client.post(url, json=task_data)
        assert response.status_code == 200
        assert response.json['status'] == task_data['status']

        url = url_for('task_api.task_status', task_id=0)
        response = self.client.post(url, json=task_data)
        assert response.status_code == 404


@pytest.mark.usefixtures('client_class', 'db_class', 'login')
class TestTimeEntryApi():

    def test_create_time_entry(self):
        task = TaskFactory.create()
        self.db.session.commit()

        url = url_for('time_entry_api.time_entries')
        time_entry_data = {
            'task_id': task.id,
            'amount': '1.50',
        }
        response = self.client.post(url, json=time_entry_data)
        assert response.status_code == 200
        assert 'time_entry' in response.json
        assert (response.json['time_entry']['task_id'] ==
                time_entry_data['task_id'])
        assert (response.json['time_entry']['amount'] ==
                time_entry_data['amount'])

    def test_update_time_entry(self):
        time_entry = TimeEntryFactory.create()
        self.db.session.commit()

        url = url_for('time_entry_api.time_entry', time_entry_id=time_entry.id)
        time_entry_data = {
            'task_id': time_entry.task_id,
            'amount': '0.60',
        }
        response = self.client.put(url, json=time_entry_data)
        assert response.status_code == 200
        assert 'time_entry' in response.json
        assert (response.json['time_entry']['amount'] ==
                time_entry_data['amount'])

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
