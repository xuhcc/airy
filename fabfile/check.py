from fabric.api import task, local


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
    local('pipenv run flake8 --max-complexity=8 fabfile')
    local('pipenv run flake8 --max-complexity=10 airy')
    local('pipenv run flake8 --max-complexity=8 alembic/env.py')


@task
def py_security():
    local('pipenv run safety check --bare')
    local('pipenv run bandit -r -x tests,settings airy')


@task
def py_types():
    local('pipenv run mypy --ignore-missing-imports airy')


@task
def py_unit():
    local('pipenv run '
          'py.test -v -x --pdb '
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
    py_types()
    py_unit()


@task(default=True)
def all():
    frontend()
    backend()
