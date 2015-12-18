from fabric.api import task, local, prefix


@task
def js():
    local('node_modules/grunt-cli/bin/grunt jsonlint jshint jscs karma')


@task
def css():
    local("node_modules/grunt-cli/bin/grunt sasslint sass csslint")


@task
def html():
    local("node_modules/grunt-cli/bin/grunt htmlhint")


@task
def python():
    with prefix(". venv/bin/activate"):
        local("flake8 --max-complexity=8 fabfile")
        local("flake8 --max-complexity=10 airy")
        local('flake8 --max-complexity=8 alembic/env.py')


@task
def flask():
    with prefix('. venv/bin/activate'):
        local('py.test -v -x --pdb '
              '--cov airy '
              '--cov-config .coveragerc '
              'airy/tests')


@task(default=True)
def all():
    js()
    css()
    html()
    python()
    flask()
