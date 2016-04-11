from fabric.api import task, local, prefix


@task
def js():
    local('npm run-script grunt jsonlint jshint jscs karma:phantomjs')


@task
def css():
    local('npm run-script grunt sasslint sass csslint')


@task
def html():
    local('npm run-script grunt htmlhint')


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
