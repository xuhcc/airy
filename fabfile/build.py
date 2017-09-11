from fabric.api import task, prefix, local


@task
def dirs():
    local('mkdir -p logs')


@task
def venv():
    local('virtualenv -p /usr/bin/python3 venv')
    with prefix('. venv/bin/activate'):
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
