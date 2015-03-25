from flask import Blueprint, render_template

from airy.utils import static

base_bp = Blueprint('base', __name__)


@base_bp.route('/')
def index():
    return render_template('index.html', assets=static.get_assets())
