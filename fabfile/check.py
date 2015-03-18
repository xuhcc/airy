from fabric.api import env, task, local, prefix


@task
def js():
    local("node_modules/grunt-cli/bin/grunt jshint jscs jasmine")


@task
def css():
    local("node_modules/grunt-cli/bin/grunt csslint")


@task
def python():
    with prefix(". venv/bin/activate"):
        local("flake8 --max-complexity=8 --ignore=F401 fabfile")
        local("flake8 --max-complexity=8 airy")


@task(default=True)
def all():
    js()
    css()
    python()
