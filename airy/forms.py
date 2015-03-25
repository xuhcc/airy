from wtforms import (
    Form,
    StringField,
    validators)


class LoginForm(Form):
    password = StringField("Password",
                           [validators.InputRequired()])
