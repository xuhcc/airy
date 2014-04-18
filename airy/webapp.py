import os
import sys
import functools

from flask import (
    Flask,
    request,
    session,
    jsonify,
    redirect,
    render_template,
    url_for,
    abort)

from airy import settings
from airy.core import db_session
from airy.units import client, project, task

app = Flask(__name__)


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


@app.route("/")
@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        password = request.form['password']
        if password == settings.password:
            session['user'] = settings.username
            return jsonify(status=0)
        else:
            return jsonify(status=1)
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
        user=settings.username,
        clients=client.get_all())


@app.route("/client/<int:client_id>", methods=["GET", "POST", "DELETE"])
@requires_auth
def client_handler(client_id):
    if request.method == "GET":
        try:
            instance = client.get(client_id)
        except client.ClientError as err:
            abort(err.code)
        return render_template(
            "projects.html",
            user=settings.username,
            client=instance)
    elif request.method == "POST":
        form_data = {
            'id': None if client_id == 0 else client_id,
            'name': request.form['name'],
            'contacts': request.form['contacts'],
        }
        try:
            instance = client.save(form_data)
        except client.ClientError as err:
            return jsonify(error_msg=err.message)
        html = render_template("client.html", client=instance)
        return jsonify(html=html, new_=(client_id == 0))
    elif request.method == "DELETE":
        try:
            client.delete(client_id)
        except client.ClientError as err:
            return jsonify(error_msg=err.message)
        return jsonify(status=0)


@app.route("/project/<int:project_id>", methods=["GET", "POST", "DELETE"])
@requires_auth
def project_handler(project_id):
    if request.method == "GET":
        try:
            instance = project.get(project_id)
        except project.ProjectError as err:
            abort(err.code)
        return render_template(
            "tasks.html",
            user=settings.username,
            project=instance,
            status="open")
    elif request.method == "POST":
        form_data = {
            'id': None if project_id == 0 else project_id,
            'name': request.form['name'],
            'description': request.form['description'],
            'client_id': request.form['client_id'],
        }
        try:
            instance = project.save(form_data)
        except project.ProjectError as err:
            return jsonify(error_msg=err.message)
        html = render_template("project.html", project=instance)
        return jsonify(html=html, new_=(project_id == 0))
    elif request.method == "DELETE":
        try:
            project.delete(project_id)
        except project.ProjectError as err:
            return jsonify(error_msg=err.message)
        return jsonify(status=0)


@app.route("/task/<int:task_id>", methods=["POST", "DELETE"])
def task_handler(task_id):
    if request.method == "POST":
        form_data = {
            'id': None if task_id == 0 else task_id,
            'title': request.form['title'],
            'description': request.form['description'],
            'project_id': request.form['project_id'],
        }
        try:
            instance = task.save(form_data)
        except task.TaskError as err:
            return jsonify(error_msg=err.message)
        html = render_template("task.html", task=instance)
        return jsonify(html=html, new_=(task_id == 0))
    elif request.method == "DELETE":
        try:
            task.delete(task_id)
        except task.TaskError as err:
            return jsonify(error_msg=err.message)
        return jsonify(status=0)


@app.route("/logout")
@requires_auth
def logout():
    session.pop('user', None)
    return redirect(url_for("login"))


def main():
    app.debug = settings.debug
    app.secret_key = settings.secret_key
    app.run(port=settings.http_port)
