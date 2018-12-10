from flask import Blueprint, render_template

from airy.utils import static
from airy.resources.client import client_api
from airy.resources.project import project_api
from airy.resources.task import task_api
from airy.resources.time_entry import time_entry_api
from airy.resources.user import user_api

base_bp = Blueprint('base', __name__)


@base_bp.route('/')
def index():
    return render_template('index.html', assets=static.get_assets())


api_bp = Blueprint('api', __name__)
client_api.init_app(api_bp)
project_api.init_app(api_bp)
task_api.init_app(api_bp)
time_entry_api.init_app(api_bp)
user_api.init_app(api_bp)
