from wtforms import (
    Form,
    IntegerField,
    StringField,
    TextAreaField,
    DecimalField,
    validators)


class LoginForm(Form):
    password = StringField("Password",
                           [validators.InputRequired()])


class ProjectForm(Form):
    id = IntegerField("Project ID")
    name = StringField("Name", [
        validators.InputRequired(),
        validators.Length(max=200)])
    description = TextAreaField("Description")
    client_id = IntegerField("Client ID", [validators.DataRequired()])


class TaskForm(Form):
    id = IntegerField("Task ID")
    title = StringField("Title", [
        validators.InputRequired(),
        validators.Length(max=200)])
    description = TextAreaField("Description")
    project_id = IntegerField("Project ID", [validators.DataRequired()])


class TaskStatusForm(Form):
    id = IntegerField("Task ID")
    status = StringField("Status", [
        validators.InputRequired(),
        validators.AnyOf(["open", "completed", "closed"])])


def not_nan(form, field):
    if field.data and field.data.is_nan():
        raise validators.StopValidation('Amount can not be NaN')


class TimeEntryForm(Form):
    id = IntegerField("Time entry ID")
    amount = DecimalField("Spent time", [
        validators.InputRequired(),
        not_nan,
        validators.NumberRange(min=0.01, max=99.99)])
    comment = TextAreaField("Comment")
    task_id = IntegerField("Task ID", [validators.DataRequired()])
