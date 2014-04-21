from wtforms import Form, IntegerField, StringField, TextAreaField, validators

from airy.models import Client, Project
from airy.core import db_session as db


class ProjectError(Exception):

    def __init__(self, message, code=500):
        self.message = message
        self.code = code


def get(project_id):
    project = db.query(Project).get(project_id)
    if not project:
        raise ProjectError("Project #{0} not found".format(project_id), 404)
    return project


class SaveForm(Form):
    id = IntegerField("Project ID",
                      filters=[lambda val: None if val == 0 else val])
    name = StringField("Name", [
        validators.InputRequired(),
        validators.Length(max=200)])
    description = TextAreaField("Description")
    client_id = IntegerField("Client ID", [validators.DataRequired()])


def save(form):
    if not form.validate():
        error_msg = ", ".join("{0}: {1}".format(k, v[0])
                              for k, v in form.errors.items())
        raise ProjectError(error_msg)
    project = Project()
    form.populate_obj(project)
    if not db.query(Client).get(project.client_id):
        raise ProjectError("Invalid client id")
    if (
        project.id is not None
        and not db.query(Project).get(project.id)
    ):
        raise ProjectError("Project #{0} not found".format(project.id))
    project = db.merge(project)
    db.commit()
    return project


def delete(project_id):
    project = db.query(Project).get(project_id)
    if not project:
        raise ProjectError("Project #{0} not found".format(project_id), 404)
    db.delete(project)
    db.commit()
