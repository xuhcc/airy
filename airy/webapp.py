import flask

import settings

app = flask.Flask(__name__)


@app.route("/")
@app.route("/login", methods=['GET', 'POST'])
def login():
    if flask.request.method == 'POST':
        password = flask.request.form['password']
        if password == settings.password:
            flask.session['user'] = settings.username
            status = 0
        else:
            status = 1
        return flask.jsonify(status=status)
    else:
        if "user" in flask.session:
            return flask.redirect(flask.url_for("dashboard"))
        return flask.render_template("login.html", title="Login")


@app.route("/dashboard")
def dashboard():
    if "user" not in flask.session:
        return flask.redirect(flask.url_for("login"))
    elif flask.session["user"] == settings.username:
        return flask.render_template(
            "dashboard.html",
            title="Dashboard",
            user=settings.username)
    else:
        return flask.redirect(flask.url_for("login"))


@app.route("/logout")
def logout():
    flask.session.pop('user', None)
    return flask.redirect(flask.url_for("login"))


if __name__ == "__main__":
    app.debug = settings.debug
    app.secret_key = settings.secret_key
    app.run(port=settings.http_port)
