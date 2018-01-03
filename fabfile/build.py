from fabric.api import task, local

from utils import virtualenv


@task
def dirs():
    local('mkdir -p logs')


@task
def venv():
    with virtualenv():
        local('pip install -r requirements_dev.txt')


@task
def frontend():
    local('npm install')
    local('npm rebuild node-sass')
    local('npm run-script grunt build:development')


@task
def watch():
    local('npm run-script grunt watch')


@task
def clean():
    local("find . -name '*.pyc' -delete")
    local('npm run-script grunt clean')


@task(default=True)
def all():
    dirs()
    venv()
    frontend()
