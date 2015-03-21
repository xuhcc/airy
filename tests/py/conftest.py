import os
import sys

sys.path.append(os.getcwd())

import pytest
from airy import create_app


@pytest.fixture
def app():
    app = create_app()
    return app
