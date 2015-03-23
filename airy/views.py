import functools

from flask import (
    Blueprint,
    request,
    session,
    jsonify,
    render_template,
    abort)
import wtforms_json

from airy import exceptions, settings
from airy.utils import static
from airy.units import (
    user,
    client,
    project,
    task,
    time_entry,
    report)

wtforms_json.init()

web = Blueprint('web', __name__)


def requires_auth(func):
    """
    Check session
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if session.get("user") != settings.username:
            return abort(403)
        else:
            return func(*args, **kwargs)
    return wrapper


@web.errorhandler(exceptions.UnitError)
def handle_unit_error(error):
    response = jsonify(error_msg=error.message)
    if error.status_code:
        response.status_code = error.status_code
    return response


@web.route("/")
def index_view():
    return render_template("index.html", assets=static.get_assets())


@web.route("/login", methods=['POST'])
def login_view():
    if request.method == 'POST':
        return jsonify(user=user.User.login(session, request.get_json()))


@web.route("/logout")
def logout_view():
    session.pop('user', None)
    return jsonify()


@web.route("/user")
def user_view():
    if session.get("user") == settings.username:
        return jsonify(user=user.User().serialize())
    else:
        return jsonify(user={})


@web.route("/clients", methods=['GET', 'POST'])
@requires_auth
def clients_view():
    if request.method == 'GET':
        # Return list of clients
        return jsonify(clients=client.get_all())
    elif request.method == 'POST':
        # Create new client
        return jsonify(client=client.save(request.get_json()))


@web.route("/clients/<int:client_id>", methods=['GET', 'PUT', 'DELETE'])
@requires_auth
def client_view(client_id):
    if request.method == 'GET':
        # Get client details
        return jsonify(client=client.get(client_id))
    elif request.method == 'PUT':
        # Update client
        return jsonify(client=client.save(request.get_json(), client_id))
    elif request.method == 'DELETE':
        # Delete client
        client.delete(client_id)
        return jsonify()


@web.route('/clients/<int:client_id>/timesheet')
@requires_auth
def timesheet_view(client_id):
    return jsonify(timesheet=report.get_timesheet(client_id))


@web.route("/projects", methods=['POST'])
@requires_auth
def projects_view():
    if request.method == 'POST':
        # Create new project
        return jsonify(project=project.save(request.get_json()))


@web.route("/projects/<int:project_id>", methods=['GET', 'PUT', 'DELETE'])
@requires_auth
def project_view(project_id):
    if request.method == 'GET':
        # Get project details
        status = request.args.get('status')
        return jsonify(project=project.get(project_id, status))
    elif request.method == 'PUT':
        # Update project
        return jsonify(project=project.save(request.get_json(), project_id))
    elif request.method == 'DELETE':
        # Delete project
        project.delete(project_id)
        return jsonify()


@web.route("/projects/<int:project_id>/report", methods=['GET', 'POST'])
@requires_auth
def project_report_view(project_id):
    if request.method == 'GET':
        # Get report
        return jsonify(report=report.ReportManager(project_id).serialize())
    elif request.method == 'POST':
        # Save report
        report.ReportManager(project_id).save()
        return jsonify()


@web.route("/reports")
@requires_auth
def reports_view():
    return jsonify(reports=report.get_all())


@web.route("/tasks", methods=['POST'])
@requires_auth
def tasks_view():
    if request.method == 'POST':
        # Create new task
        return jsonify(task=task.save(request.get_json()))


@web.route("/tasks/<int:task_id>", methods=['PUT', 'DELETE'])
@requires_auth
def task_view(task_id):
    if request.method == 'PUT':
        # Update task
        return jsonify(task=task.save(request.get_json(), task_id))
    elif request.method == "DELETE":
        # Delete task
        task.delete(task_id)
        return jsonify()


@web.route("/tasks/<int:task_id>/status", methods=['POST'])
@requires_auth
def task_status_view(task_id):
    if request.method == 'POST':
        # Set task status
        status = task.set_status(request.get_json(), task_id)
        return jsonify(status=status)


@web.route("/time_entries", methods=['POST'])
@requires_auth
def time_entries_view():
    if request.method == 'POST':
        # Create new time entry
        return jsonify(time_entry=time_entry.save(request.get_json()))


@web.route("/time_entries/<int:time_entry_id>", methods=['PUT', 'DELETE'])
@requires_auth
def time_entry_view(time_entry_id):
    if request.method == 'PUT':
        # Update time entry
        result = time_entry.save(request.get_json(), time_entry_id)
        return jsonify(time_entry=result)
    elif request.method == 'DELETE':
        # Delete time entry
        return jsonify(task_total_time=time_entry.delete(time_entry_id))
