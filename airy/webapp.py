import functools

from flask import (
    Flask,
    request,
    session,
    jsonify,
    redirect,
    render_template,
    url_for)
import wtforms_json

from airy import exceptions, forms, report, settings
from airy.core import db_session
from airy.units import client, project, task, time_entry
from airy.user import User

wtforms_json.init()

app = Flask(__name__)
app.debug = settings.debug
app.secret_key = settings.secret_key
app.session_cookie_name = "airy_session"


def requires_auth(func):
    """
    Check session
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if "user" not in session or session["user"] != settings.username:
            return redirect(url_for("login"))
        else:
            return func(*args, **kwargs)
    return wrapper


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@app.errorhandler(exceptions.UnitError)
def handle_unit_error(error):
    response = jsonify(error_msg=error.message)
    if error.status_code:
        response.status_code = error.status_code
    return response


@app.route("/")
@requires_auth
def index():
    return render_template("index.html")


@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        form = forms.LoginForm(request.form)
        if form.validate() and form.password.data == settings.password:
            session['user'] = settings.username
            return jsonify(code=0)
        else:
            return jsonify(code=1)
    else:
        if "user" in session:
            return redirect(url_for("index"))
        return render_template("login.html")


@app.route("/logout")
@requires_auth
def logout():
    session.pop('user', None)
    return redirect(url_for("login"))


@app.route("/user")
@requires_auth
def user_view():
    return jsonify(user=User().serialize())


@app.route("/clients", methods=['GET', 'POST'])
@requires_auth
def clients_view():
    if request.method == 'GET':
        # Return list of clients
        return jsonify(clients=client.get_all())
    elif request.method == 'POST':
        # Create new client
        return jsonify(client=client.save(request.get_json()))


@app.route("/clients/<int:client_id>", methods=['GET', 'PUT', 'DELETE'])
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


@app.route("/projects", methods=['POST'])
@requires_auth
def projects_view():
    if request.method == 'POST':
        # Create new project
        return jsonify(project=project.save(request.get_json()))


@app.route("/projects/<int:project_id>", methods=['GET', 'PUT', 'DELETE'])
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


@app.route("/projects/<int:project_id>/report", methods=['GET', 'POST'])
@requires_auth
def project_report_view(project_id):
    if request.method == 'GET':
        # Get report
        return jsonify(report=report.ReportManager(project_id).serialize())
    elif request.method == 'POST':
        # Save report
        report.ReportManager(project_id).save()
        return jsonify()


@app.route("/reports")
@requires_auth
def reports_view():
    return jsonify(reports=report.get_all())


@app.route("/tasks", methods=['POST'])
@requires_auth
def tasks_view():
    if request.method == 'POST':
        # Create new task
        return jsonify(task=task.save(request.get_json()))


@app.route("/tasks/<int:task_id>", methods=['PUT', 'DELETE'])
@requires_auth
def task_view(task_id):
    if request.method == 'PUT':
        # Update task
        return jsonify(task=task.save(request.get_json(), task_id))
    elif request.method == "DELETE":
        # Delete task
        task.delete(task_id)
        return jsonify()


@app.route("/tasks/<int:task_id>/status", methods=['POST'])
@requires_auth
def task_status_view(task_id):
    if request.method == 'POST':
        task.set_status(request.get_json(), task_id)
        return jsonify()


@app.route("/time_entries", methods=['POST'])
@requires_auth
def time_entries_view():
    if request.method == 'POST':
        # Create new time entry
        return jsonify(time_entry=time_entry.save(request.get_json()))


@app.route("/time_entries/<int:time_entry_id>", methods=['PUT', 'DELETE'])
@requires_auth
def time_entry_view(time_entry_id):
    if request.method == 'PUT':
        # Update time entry
        result = time_entry.save(request.get_json(), time_entry_id)
        return jsonify(time_entry=result)
    elif request.method == 'DELETE':
        # Delete time entry
        return jsonify(task_total_time=time_entry.delete(time_entry_id))


def main():
    app.run(host=settings.http_host, port=settings.http_port)
