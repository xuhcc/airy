from fabric.api import task, local, prefix


@task
def js():
    local('npm run grunt check:js --silent')


@task
def css():
    local('npm run grunt check:css --silent')


@task
def html():
    local('npm run grunt check:html --silent')


@task
def py_style():
    with prefix('. venv/bin/activate'):
        local('flake8 --max-complexity=8 fabfile')
        local('flake8 --max-complexity=10 airy')
        local('flake8 --max-complexity=8 alembic/env.py')


@task
def py_security():
    with prefix('. venv/bin/activate'):
        local('safety check')
        local('bandit -r -x tests,settings airy')


@task
def py_unit():
    with prefix('. venv/bin/activate'):
        local('py.test -v -x --pdb '
              '--cov airy '
              '--cov-config .coveragerc '
              'airy/tests')


@task
def frontend():
    js()
    css()
    html()


@task
def backend():
    py_style()
    py_security()
    py_unit()


@task(default=True)
def all():
    frontend()
    backend()
