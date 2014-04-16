import os
import sys

from flask import (
    Flask,
    request,
    session,
    jsonify,
    redirect,
    render_template,
    url_for)

from airy import settings
from airy.units import client

app = Flask(__name__)


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
        return render_template("login.html", title="Login")


@app.route("/clients")
def clients():
    """
    Show a list of clients
    """
    if "user" not in session:
        return redirect(flask.url_for("login"))
    elif session["user"] == settings.username:
        return render_template(
            "clients.html",
            title="Clients",
            user=settings.username,
            clients=client.get_all())
    else:
        return redirect(url_for("login"))


@app.route("/client/<int:client_id>", methods=["POST", "DELETE"])
def client_handler(client_id):
    if request.method == "POST":
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
        return jsonify(html=html, _new=(client_id == 0))
    elif request.method == "DELETE":
        try:
            client.delete(client_id)
        except client.ClientError as err:
            return jsonify(error_msg=err.message)
        return jsonify(status=0)


@app.route("/logout")
def logout():
    session.pop('user', None)
    return redirect(url_for("login"))


def main():
    app.debug = settings.debug
    app.secret_key = settings.secret_key
    app.run(port=settings.http_port)
