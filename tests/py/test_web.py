import pytest
from flask import url_for, session

from airy import settings


def test_index(client):
    url = url_for('web.index_view')
    response = client.get(url)
    assert response.status_code == 200


@pytest.mark.usefixtures('client_class')
class TestLogin():

    def test_login(self):
        login_url = url_for('web.login_view')
        response = self.client.post(login_url,
                                    json={'password': settings.password})
        assert response.status_code == 200
        user = response.json['user']
        assert user['name'] == settings.username
        assert 'user' in session

    def test_login_error(self):
        login_url = url_for('web.login_view')
        response = self.client.post(login_url, json={'password': '-'})
        assert response.status_code == 200
        assert response.json['error_msg'] == 'Incorrect password'

    def test_logout(self):
        login_url = url_for('web.login_view')
        self.client.post(login_url,
                         json={'password': settings.password})
        assert 'user' in session
        logout_url = url_for('web.logout_view')
        response = self.client.get(logout_url)
        assert 'user' not in session
        assert response.status_code == 200

    def test_user(self):
        login_url = url_for('web.login_view')
        self.client.post(login_url,
                         json={'password': settings.password})
        user_url = url_for('web.user_view')
        response = self.client.get(user_url)
        assert response.status_code == 200
        assert response.json['user']['name'] == settings.username
        assert response.json['user']['open_tasks'] == 0

    def test_anonymous_user(self):
        user_url = url_for('web.user_view')
        response = self.client.get(user_url)
        assert response.status_code == 200
        assert response.json['user'] == {}
