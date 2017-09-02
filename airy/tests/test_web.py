import pytest
from flask import url_for, session

from airy import settings


def test_index(client):
    url = url_for('base.index')
    response = client.get(url)
    assert response.status_code == 200


@pytest.mark.usefixtures('client_class')
class TestLogin():

    def test_login(self):
        login_url = url_for('user_api.login')
        response = self.client.post(
            login_url,
            json={'password': settings.USER_PASSWORD})
        assert response.status_code == 200
        user = response.json['user']
        assert user['name'] == settings.USER_NAME
        assert 'user' in session

    def test_login_error(self):
        login_url = url_for('user_api.login')
        response = self.client.post(login_url, json={'password': '-'})
        assert response.status_code == 400
        assert response.json['error_msg'] == 'Incorrect password'

    def test_logout(self):
        login_url = url_for('user_api.login')
        self.client.post(login_url,
                         json={'password': settings.USER_PASSWORD})
        assert 'user' in session
        logout_url = url_for('user_api.logout')
        response = self.client.get(logout_url)
        assert 'user' not in session
        assert response.status_code == 200

    def test_user(self):
        login_url = url_for('user_api.login')
        self.client.post(login_url,
                         json={'password': settings.USER_PASSWORD})
        user_url = url_for('user_api.user')
        response = self.client.get(user_url)
        assert response.status_code == 200
        assert response.json['user']['name'] == settings.USER_NAME
        assert response.json['user']['open_tasks'] == 0

    def test_anonymous_user(self):
        user_url = url_for('user_api.user')
        response = self.client.get(user_url)
        assert response.status_code == 200
        assert response.json['user'] == {}
