from fabric.api import env, task, local, prefix


@task
def js():
    local("node_modules/grunt-cli/bin/grunt jshint")


@task
def css():
    local("node_modules/grunt-cli/bin/grunt csslint")


@task
def python():
    with prefix(". venv/bin/activate"):
        local("pep8 fabfile")
        local("pep8 airy")


@task(default=True)
def all():
    js()
    css()
    python()
