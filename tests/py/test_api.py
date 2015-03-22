import pytest
from flask import url_for

from airy import settings
from factories import ClientFactory


@pytest.fixture(scope='module')
def login(client):
    login_url = url_for('web.login_view')
    client.post(login_url,
                json={'password': settings.password})


@pytest.mark.usefixtures('client_class', 'db_class', 'login')
class TestApi():

    def test_create_client(self):
        url = url_for('web.clients_view')
        client_data = {'name': 'Test Client'}
        response = self.client.post(url, json=client_data)
        assert response.status_code == 200
        assert 'client' in response.json
        assert response.json['client']['name'] == client_data['name']

    def test_list_clients(self):
        url = url_for('web.clients_view')
        response = self.client.get(url)
        assert response.status_code == 200
        assert 'clients' in response.json
        assert len(response.json['clients']) == 0

        ClientFactory.create_batch(3)
        response = self.client.get(url)
        assert len(response.json['clients']) == 3

    def test_get_client(self):
        client = ClientFactory.create()
        self.db.session.commit()

        url = url_for('web.client_view', client_id=client.id)
        response = self.client.get(url)
        assert response.status_code == 200
        assert 'client' in response.json
        assert response.json['client']['name'] == client.name

    def test_update_client(self):
        client = ClientFactory.create(name='Old Name')
        self.db.session.commit()

        url = url_for('web.client_view', client_id=client.id)
        client_data = {'name': 'New Name'}
        response = self.client.put(url, json=client_data)
        assert response.status_code == 200
        assert 'client' in response.json
        assert response.json['client']['name'] == client_data['name']

    def test_delete_client(self):
        client = ClientFactory.create()
        self.db.session.commit()

        url = url_for('web.client_view', client_id=client.id)
        response = self.client.delete(url)
        assert response.status_code == 200

        response = self.client.delete(url)
        assert response.status_code == 404
