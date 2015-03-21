from fabric.api import task, local, prefix


@task
def js():
    local("node_modules/grunt-cli/bin/grunt jshint jscs jasmine")


@task
def css():
    local("node_modules/grunt-cli/bin/grunt csslint")


@task
def python():
    with prefix(". venv/bin/activate"):
        local("flake8 --max-complexity=8 fabfile")
        local("flake8 --max-complexity=8 airy")
        local('flake8 --max-complexity=8 alembic/env.py')
        local("flake8 --max-complexity=8 tests/py")


@task
def flask():
    with prefix('. venv/bin/activate'):
        local('py.test tests/py')


@task(default=True)
def all():
    js()
    css()
    python()
    flask()
