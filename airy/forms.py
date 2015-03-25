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
