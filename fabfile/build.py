from fabric.api import env, task, settings, prefix, local


@task
def dirs():
    env.run("mkdir -p logs")


@task
def venv(production=False):
    with settings(warn_only=True):
        test_command = "test requirements.txt -ot venv/bin/activate"
        if not production:
            test_command += ' -a requirements_dev.txt -ot venv/bin/activate'
        result = env.run(test_command)
    if result.failed:
        env.run("virtualenv venv")
        with prefix(". venv/bin/activate"):
            if production:
                env.run("pip install -q -r requirements.txt --upgrade")
            else:
                env.run('pip install -r requirements_dev.txt --upgrade')
        env.run("touch venv/bin/activate")


@task
def frontend(production=False):
    if production:
        env.run('npm install --production')
        env.run('npm rebuild node-sass')
        env.run('npm run-script bower update --production')
        env.run('npm run-script grunt build:production')
    else:
        env.run('npm install')
        env.run('npm rebuild node-sass')
        env.run('npm run-script bower update')
        env.run('npm run-script grunt build:development')


@task
def watch():
    env.run('npm run-script grunt watch')


@task
def clean():
    local("find . -name '*.pyc' -delete")
    local('npm run-script grunt clean')


@task(default=True)
def all(production=False):
    dirs()
    venv(production=production)
    frontend(production=production)
