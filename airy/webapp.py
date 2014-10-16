import os
import sys
import functools
import re

from flask import (
    Flask,
    request,
    session,
    jsonify,
    redirect,
    render_template,
    url_for,
    abort)
from jinja2 import evalcontextfilter, Markup, escape
import bleach
import wtforms_json

from airy import exceptions, report, serializers, settings, user
from airy.core import db_session
from airy.units import client, project, task, time_entry

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


@app.template_filter()
@evalcontextfilter
def nl2br(eval_ctx, value):
    """
    http://flask.pocoo.org/snippets/28/
    """
    br = '<br>'
    if eval_ctx.autoescape:
        value, br = escape(value), Markup(br)
    return value.replace('\n', br)


@app.template_filter()
@evalcontextfilter
def linkify(eval_ctx, value):
    if not isinstance(value, Markup) and eval_ctx.autoescape:
        value = escape(value)
    callbacks = bleach.DEFAULT_CALLBACKS
    callbacks.append(bleach.callbacks.target_blank)
    result = bleach.linkify(value, callbacks=callbacks, parse_email=True)
    return Markup(result)


@app.template_filter()
def dtformat(value, fmt="datetime"):
    if fmt == "datetime":
        return value.strftime("%d.%m.%Y %H:%M")
    elif fmt == "date":
        return value.strftime("%d.%m.%Y")


@app.route("/")
@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        form = user.LoginForm(request.form)
        if form.validate() and form.password.data == settings.password:
            session['user'] = settings.username
            return jsonify(code=0)
        else:
            return jsonify(code=1)
    else:
        if "user" in session:
            return redirect(url_for("clients"))
        return render_template("login.html")


@app.route("/clients")
@requires_auth
def clients():
    """
    Show a list of clients
    """
    return render_template(
        "clients.html",
        user=user.User(),
        clients=client.get_all())


@app.route("/client/<int:client_id>", methods=["GET", "POST", "DELETE"])
@requires_auth
def client_handler(client_id):
    if request.method == "GET":
        if client_id == 0:
            instance = client.Client(id=client_id)
        else:
            try:
                instance = client.get(client_id)
            except exceptions.ClientError as err:
                return jsonify(error_msg=err.message)
        html = render_template("units/client_form.html", client=instance)
        return jsonify(html=html)
    elif request.method == "POST":
        form = client.SaveForm(request.form, id=client_id)
        try:
            instance = client.save(form)
        except exceptions.ClientError as err:
            return jsonify(error_msg=err.message)
        html = render_template("units/client.html", client=instance)
        return jsonify(html=html, new_=(client_id == 0))
    elif request.method == "DELETE":
        try:
            client.delete(client_id)
        except exceptions.ClientError as err:
            return jsonify(error_msg=err.message)
        return jsonify(code=0)


@app.route("/client/<int:client_id>/projects")
@requires_auth
def projects(client_id):
    try:
        instance = client.get(client_id)
    except exceptions.ClientError as err:
        abort(err.code)
    return render_template(
        "projects.html",
        user=user.User(),
        client=instance)


@app.route("/project/<int:project_id>", methods=["GET", "POST", "DELETE"])
@requires_auth
def project_handler(project_id):
    if request.method == "GET":
        if project_id == 0:
            instance = project.Project(id=project_id)
        else:
            try:
                instance = project.get(project_id)
            except exceptions.ProjectError as err:
                return jsonify(error_msg=err.message)
        html = render_template("units/project_form.html", project=instance)
        return jsonify(html=html)
    elif request.method == "POST":
        form = project.SaveForm(request.form, id=project_id)
        try:
            instance = project.save(form)
        except exceptions.ProjectError as err:
            return jsonify(error_msg=err.message)
        html = render_template("units/project.html", project=instance)
        return jsonify(html=html, new_=(project_id == 0))
    elif request.method == "DELETE":
        try:
            project.delete(project_id)
        except exceptions.ProjectError as err:
            return jsonify(error_msg=err.message)
        return jsonify(code=0)


@app.route("/project/<int:project_id>/report")
@requires_auth
def project_report(project_id):
    try:
        instance = report.ReportManager(project_id)
    except exceptions.ProjectError as err:
        abort(err.code)
    return render_template(
        "report.html",
        user=user.User(),
        report=instance)


@app.route("/project/<int:project_id>/save_report", methods=['POST'])
@requires_auth
def project_save_report(project_id):
    try:
        instance = report.ReportManager(project_id)
        instance.save()
    except exceptions.ProjectError as err:
        return jsonify(error_msg=err.message)
    return jsonify(code=0)


@app.route("/reports")
@requires_auth
def reports():
    return render_template(
        "reports.html",
        user=user.User(),
        reports=report.get_all())


@app.route("/project/<int:project_id>/tasks")
@requires_auth
def tasks(project_id):
    try:
        instance = project.get(project_id)
    except exceptions.ProjectError as err:
        abort(err.code)
    return render_template(
        "tasks.html",
        user=user.User(),
        project=instance,
        closed=False)


@app.route("/project/<int:project_id>/closed_tasks")
@requires_auth
def closed_tasks(project_id):
    try:
        instance = project.get(project_id)
    except exceptions.ProjectError as err:
        abort(err.code)
    return render_template(
        "tasks.html",
        user=user.User(),
        project=instance,
        closed=True)


@app.route("/task/<int:task_id>", methods=["GET", "POST", "DELETE"])
@requires_auth
def task_handler(task_id):
    if request.method == "GET":
        if task_id == 0:
            instance = task.Task(id=task_id)
        else:
            try:
                instance = task.get(task_id)
            except exceptions.TaskError as err:
                return jsonify(error_msg=err.message)
        html = render_template("units/task_form.html", task=instance)
        return jsonify(html=html)
    elif request.method == "POST":
        form = task.SaveForm(request.form, id=task_id)
        try:
            instance = task.save(form)
        except exceptions.TaskError as err:
            return jsonify(error_msg=err.message)
        html = render_template("units/task.html", task=instance)
        return jsonify(html=html, new_=(task_id == 0))
    elif request.method == "DELETE":
        try:
            task.delete(task_id)
        except exceptions.TaskError as err:
            return jsonify(error_msg=err.message)
        return jsonify(code=0)


@app.route("/task/<int:task_id>/status", methods=["POST"])
@requires_auth
def task_status_handler(task_id):
    if request.method == "POST":
        form = task.StatusForm(request.form, id=task_id)
        try:
            task.set_status(form)
        except exceptions.TaskError as err:
            return jsonify(error_msg=err.message)
        return jsonify(open_tasks=user.User().open_tasks)


@app.route("/time-entry/<int:time_entry_id>",
           methods=["GET", "POST", "DELETE"])
@requires_auth
def time_entry_handler(time_entry_id):
    if request.method == "GET":
        if time_entry_id == 0:
            instance = time_entry.TimeEntry(id=time_entry_id)
        else:
            try:
                instance = time_entry.get(time_entry_id)
            except exceptions.TimeEntryError as err:
                return jsonify(error_msg=err.message)
        html = render_template("units/time_entry_form.html",
                               time_entry=instance)
        return jsonify(html=html)
    elif request.method == "POST":
        form = time_entry.SaveForm(request.form, id=time_entry_id)
        try:
            instance = time_entry.save(form)
        except exceptions.TimeEntryError as err:
            return jsonify(error_msg=err.message)
        html = render_template("units/time_entry.html", time_entry=instance)
        return jsonify(
            html=html,
            new_=(time_entry_id == 0),
            total=float(instance.task.total_time),
            total_today=float(user.User().total_today),
            total_week=float(user.User().total_week))
    elif request.method == "DELETE":
        try:
            task_total_time = time_entry.delete(time_entry_id)
        except exceptions.TimeEntryError as err:
            return jsonify(error_msg=err.message)
        return jsonify(
            total=float(task_total_time),
            total_today=float(user.User().total_today),
            total_week=float(user.User().total_week))


@app.route("/logout")
@requires_auth
def logout():
    session.pop('user', None)
    return redirect(url_for("login"))


@app.route("/index")
@requires_auth
def index():
    return render_template("index.html")


@app.route("/api/user")
@requires_auth
def user_json():
    serialized = serializers.UserSerializer(user.User())
    return jsonify(user=serialized.data)


@app.route("/api/clients", methods=['GET', 'POST'])
@requires_auth
def clients_json():
    if request.method == 'GET':
        # Return list of clients
        serialized = serializers.ClientSerializer(
            client.get_all(),
            many=True)
        return jsonify(clients=serialized.data)
    elif request.method == 'POST':
        # Create new client
        form = client.SaveForm.from_json(request.get_json(), id=0)
        try:
            instance = client.save(form)
        except exceptions.ClientError as err:
            return jsonify(error_msg=err.message)
        serialized_client = serializers.ClientSerializer(instance)
        return jsonify(client=serialized_client.data)


@app.route("/api/clients/<int:client_id>", methods=['GET', 'PUT', 'DELETE'])
@requires_auth
def client_json(client_id):
    if request.method == 'GET':
        # Get client details
        try:
            instance = client.get(client_id)
        except exceptions.ClientError as err:
            abort(err.code)
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
        try:
            instance = client.save(form)
        except exceptions.ClientError as err:
            return jsonify(error_msg=err.message)
        serialized_client = serializers.ClientSerializer(instance)
        return jsonify(client=serialized_client.data)
    elif request.method == 'DELETE':
        # Delete client
        try:
            client.delete(client_id)
        except exceptions.ClientError as err:
            return jsonify(error_msg=err.message)
        return jsonify()


@app.route("/api/projects", methods=['POST'])
@requires_auth
def projects_json():
    if request.method == 'POST':
        # Create new project
        form = project.SaveForm.from_json(request.get_json(), id=0)
        try:
            instance = project.save(form)
        except exceptions.ProjectError as err:
            return jsonify(error_msg=err.message)
        serialized_project = serializers.ProjectSerializer(instance)
        return jsonify(project=serialized_project.data)


@app.route("/api/projects/<int:project_id>", methods=['GET', 'PUT', 'DELETE'])
@requires_auth
def project_json(project_id):
    if request.method == 'GET':
        # Get project details
        try:
            instance = project.get(project_id)
        except exceptions.ProjectError as err:
            abort(err.code)
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
        try:
            instance = project.save(form)
        except exceptions.ProjectError as err:
            return jsonify(error_msg=err.message)
        serialized_project = serializers.ProjectSerializer(instance)
        return jsonify(project=serialized_project.data)
    elif request.method == 'DELETE':
        # Delete project
        try:
            project.delete(project_id)
        except exceptions.ProjectError as err:
            return jsonify(error_msg=err.message)
        return jsonify()


@app.route("/api/tasks", methods=['POST'])
@requires_auth
def tasks_json():
    if request.method == 'POST':
        # Create new task
        form = task.SaveForm.from_json(request.get_json(), id=0)
        try:
            instance = task.save(form)
        except exceptions.TaskError as err:
            return jsonify(error_msg=err.message)
        serialized_task = serializers.TaskSerializer(instance)
        return jsonify(task=serialized_task.data)


@app.route("/api/tasks/<int:task_id>", methods=['PUT', 'DELETE'])
@requires_auth
def task_json(task_id):
    if request.method == 'PUT':
        # Update task
        form = task.SaveForm.from_json(request.get_json(), id=task_id)
        try:
            instance = task.save(form)
        except exceptions.TaskError as err:
            return jsonify(error_msg=err.message)
        serialized_task = serializers.TaskSerializer(instance)
        return jsonify(task=serialized_task.data)
    elif request.method == "DELETE":
        # Delete task
        try:
            task.delete(task_id)
        except exceptions.TaskError as err:
            return jsonify(error_msg=err.message)
        return jsonify()


@app.route("/api/tasks/<int:task_id>/status", methods=['POST'])
@requires_auth
def task_status_json(task_id):
    if request.method == 'POST':
        form = task.StatusForm.from_json(request.get_json(), id=task_id)
        try:
            task.set_status(form)
        except exceptions.TaskError as err:
            return jsonify(error_msg=err.message)
        return jsonify()


@app.route("/api/time_entries", methods=['POST'])
@requires_auth
def time_entries_json():
    if request.method == 'POST':
        # Create new time entry
        form = time_entry.SaveForm.from_json(request.get_json(), id=0)
        try:
            instance = time_entry.save(form)
        except exceptions.TimeEntryError as err:
            return jsonify(error_msg=err.message)
        serialized_task = serializers.TaskSerializer(
            instance.task, only=['total_time'])
        serialized_time_entry = serializers.TimeEntrySerializer(instance)
        return jsonify(
            task=serialized_task.data,
            time_entry=serialized_time_entry.data)


@app.route("/api/time_entries/<int:time_entry_id>", methods=['PUT', 'DELETE'])
@requires_auth
def time_entry_json(time_entry_id):
    if request.method == 'PUT':
        # Update time entry
        form = time_entry.SaveForm.from_json(
            request.get_json(), id=time_entry_id)
        try:
            instance = time_entry.save(form)
        except exceptions.TimeEntryError as err:
            return jsonify(error_msg=err.message)
        serialized_task = serializers.TaskSerializer(
            instance.task, only=['total_time'])
        serialized_time_entry = serializers.TimeEntrySerializer(instance)
        return jsonify(
            task=serialized_task.data,
            time_entry=serialized_time_entry.data)
    elif request.method == 'DELETE':
        # Delete time entry
        try:
            total_time = time_entry.delete(time_entry_id)
        except exceptions.TimeEntryError as err:
            return jsonify(error_msg=err.message)
        return jsonify(task={'total_time': str(total_time)})


@app.route("/api/projects/<int:project_id>/report", methods=['GET', 'POST'])
@requires_auth
def project_report_json(project_id):
    if request.method == 'GET':
        # Get report
        try:
            instance = report.ReportManager(project_id)
        except exceptions.ProjectError as err:
            abort(err.code)
        serialized_report = serializers.ReportSerializer(
            instance,
            exclude=['created'])
        return jsonify(report=serialized_report.data)
    elif request.method == 'POST':
        # Save report
        try:
            instance = report.ReportManager(project_id)
            instance.save()
        except exceptions.ProjectError as err:
            return jsonify(error_msg=err.message)
        return jsonify()


@app.route("/api/reports")
@requires_auth
def reports_json():
    serialized_reports = serializers.ReportSerializer(
        report.get_all(),
        only=['project', 'created', 'total_time'],
        many=True)
    return jsonify(reports=serialized_reports.data)


def main():
    app.run(host=settings.http_host, port=settings.http_port)
