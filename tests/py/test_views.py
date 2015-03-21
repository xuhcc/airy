import pytest
from flask import url_for


@pytest.mark.usefixtures('client_class')
class TestWeb:

    def test_index(self):
        url = url_for('web.index_view')
        response = self.client.get(url)
        assert response.status_code == 200
