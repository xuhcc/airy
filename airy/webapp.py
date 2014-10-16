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

from airy import exceptions, report, serializers, settings
from airy.core import db_session
from airy.units import client, project, task, time_entry
from airy.user import LoginForm, User

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
        form = LoginForm(request.form)
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
    serialized = serializers.UserSerializer(User())
    return jsonify(user=serialized.data)


@app.route("/clients", methods=['GET', 'POST'])
@requires_auth
def clients_view():
    if request.method == 'GET':
        # Return list of clients
        serialized = serializers.ClientSerializer(
            client.get_all(),
            many=True)
        return jsonify(clients=serialized.data)
    elif request.method == 'POST':
        # Create new client
        form = client.SaveForm.from_json(request.get_json(), id=0)
        instance = client.save(form)
        serialized_client = serializers.ClientSerializer(instance)
        return jsonify(client=serialized_client.data)


@app.route("/clients/<int:client_id>", methods=['GET', 'PUT', 'DELETE'])
@requires_auth
def client_view(client_id):
    if request.method == 'GET':
        # Get client details
        instance = client.get(client_id)
        serialized_client = serializers.ClientSerializer(
            instance,
            only=['id', 'name'])
        serialized_projects = serializers.ProjectSerializer(
            instance.projects,
            many=True)
        return jsonify(client=serialized_client.data,
                       projects=serialized_projects.data)
    elif request.method == 'PUT':
        # Update client
        form = client.SaveForm.from_json(request.get_json(), id=client_id)
        instance = client.save(form)
        serialized_client = serializers.ClientSerializer(instance)
        return jsonify(client=serialized_client.data)
    elif request.method == 'DELETE':
        # Delete client
        client.delete(client_id)
        return jsonify()


@app.route("/projects", methods=['POST'])
@requires_auth
def projects_view():
    if request.method == 'POST':
        # Create new project
        form = project.SaveForm.from_json(request.get_json(), id=0)
        instance = project.save(form)
        serialized_project = serializers.ProjectSerializer(instance)
        return jsonify(project=serialized_project.data)


@app.route("/projects/<int:project_id>", methods=['GET', 'PUT', 'DELETE'])
@requires_auth
def project_view(project_id):
    if request.method == 'GET':
        # Get project details
        instance = project.get(project_id)
        status = request.args.get('status')
        serialized_project = serializers.ProjectSerializer(
            instance,
            only=['id', 'name'])
        serialized_tasks = serializers.TaskSerializer(
            instance.selected_tasks(closed=(status == 'closed')),
            many=True)
        return jsonify(project=serialized_project.data,
                       tasks=serialized_tasks.data)
    elif request.method == 'PUT':
        # Update project
        form = project.SaveForm.from_json(request.get_json(), id=project_id)
        instance = project.save(form)
        serialized_project = serializers.ProjectSerializer(instance)
        return jsonify(project=serialized_project.data)
    elif request.method == 'DELETE':
        # Delete project
        project.delete(project_id)
        return jsonify()


@app.route("/projects/<int:project_id>/report", methods=['GET', 'POST'])
@requires_auth
def project_report_view(project_id):
    if request.method == 'GET':
        # Get report
        instance = report.ReportManager(project_id)
        serialized_report = serializers.ReportSerializer(
            instance,
            exclude=['created'])
        return jsonify(report=serialized_report.data)
    elif request.method == 'POST':
        # Save report
        instance = report.ReportManager(project_id)
        instance.save()
        return jsonify()


@app.route("/reports")
@requires_auth
def reports_view():
    serialized_reports = serializers.ReportSerializer(
        report.get_all(),
        only=['project', 'created', 'total_time'],
        many=True)
    return jsonify(reports=serialized_reports.data)


@app.route("/tasks", methods=['POST'])
@requires_auth
def tasks_view():
    if request.method == 'POST':
        # Create new task
        form = task.SaveForm.from_json(request.get_json(), id=0)
        instance = task.save(form)
        serialized_task = serializers.TaskSerializer(instance)
        return jsonify(task=serialized_task.data)


@app.route("/tasks/<int:task_id>", methods=['PUT', 'DELETE'])
@requires_auth
def task_view(task_id):
    if request.method == 'PUT':
        # Update task
        form = task.SaveForm.from_json(request.get_json(), id=task_id)
        instance = task.save(form)
        serialized_task = serializers.TaskSerializer(instance)
        return jsonify(task=serialized_task.data)
    elif request.method == "DELETE":
        # Delete task
        task.delete(task_id)
        return jsonify()


@app.route("/tasks/<int:task_id>/status", methods=['POST'])
@requires_auth
def task_status_view(task_id):
    if request.method == 'POST':
        form = task.StatusForm.from_json(request.get_json(), id=task_id)
        task.set_status(form)
        return jsonify()


@app.route("/time_entries", methods=['POST'])
@requires_auth
def time_entries_view():
    if request.method == 'POST':
        # Create new time entry
        form = time_entry.SaveForm.from_json(request.get_json(), id=0)
        instance = time_entry.save(form)
        serialized_task = serializers.TaskSerializer(
            instance.task, only=['total_time'])
        serialized_time_entry = serializers.TimeEntrySerializer(instance)
        return jsonify(
            task=serialized_task.data,
            time_entry=serialized_time_entry.data)


@app.route("/time_entries/<int:time_entry_id>", methods=['PUT', 'DELETE'])
@requires_auth
def time_entry_view(time_entry_id):
    if request.method == 'PUT':
        # Update time entry
        form = time_entry.SaveForm.from_json(
            request.get_json(), id=time_entry_id)
        instance = time_entry.save(form)
        serialized_task = serializers.TaskSerializer(
            instance.task, only=['total_time'])
        serialized_time_entry = serializers.TimeEntrySerializer(instance)
        return jsonify(
            task=serialized_task.data,
            time_entry=serialized_time_entry.data)
    elif request.method == 'DELETE':
        # Delete time entry
        total_time = time_entry.delete(time_entry_id)
        return jsonify(task={'total_time': str(total_time)})


def main():
    app.run(host=settings.http_host, port=settings.http_port)
