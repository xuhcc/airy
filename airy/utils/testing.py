"""
Test utilities
"""
import json

from flask.testing import FlaskClient


class ApiClient(FlaskClient):
    """
    JSON-aware test client
    """
    def open(self, *args, **kwargs):
        data = kwargs.pop('json', None)
        if data:
            kwargs['data'] = json.dumps(data)
            kwargs['content_type'] = 'application/json'
        return super(ApiClient, self).open(*args, **kwargs)
