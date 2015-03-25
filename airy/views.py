from flask import Blueprint, render_template
import wtforms_json

from airy.utils import static

wtforms_json.init()

base_bp = Blueprint('base', __name__)


@base_bp.route('/')
def index():
    return render_template('index.html', assets=static.get_assets())
