import pytest
from flask import url_for

from airy import settings


@pytest.mark.usefixtures('client_class')
class TestWeb():

    def test_index(self):
        url = url_for('web.index_view')
        response = self.client.get(url)
        assert response.status_code == 200

    def test_login(self):
        login_url = url_for('web.login_view')
        response = self.client.post(login_url,
                                    json={'password': settings.password})
        assert 'user' in response.json
        return response


@pytest.mark.usefixtures('client_class')
class TestApi():

    def login(self):
        login_url = url_for('web.login_view')
        self.client.post(login_url,
                         json={'password': settings.password})

    def test_create_client(self):
        self.login()
        url = url_for('web.clients_view')
        response = self.client.post(url, json={'name': 'Test Client'})
        assert response.status_code == 200
        assert 'client' in response.json
