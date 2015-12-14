from fabric.api import env, task, settings, prefix


@task
def dirs():
    env.run("mkdir -p logs")


@task
def venv(production=False):
    with settings(warn_only=True):
        test_command = "test requirements.txt -ot venv/bin/activate"
        if not production:
            test_command += " -a requirements-dev.txt -ot venv/bin/activate"
        result = env.run(test_command)
    if result.failed:
        env.run("virtualenv venv")
        with prefix(". venv/bin/activate"):
            if production:
                env.run("pip install -q -r requirements.txt --upgrade")
            else:
                env.run("pip install -r requirements-dev.txt --upgrade")
        env.run("touch venv/bin/activate")


@task
def frontend(production=False):
    if production:
        env.run("npm install --production")
        env.run("node_modules/bower/bin/bower install --production")
        env.run("node_modules/grunt-cli/bin/grunt build:production")
    else:
        env.run("npm install")
        env.run("node_modules/bower/bin/bower install")
        env.run("node_modules/grunt-cli/bin/grunt build:development")


@task
def watch():
    env.run("node_modules/grunt-cli/bin/grunt watch")


@task
def clean():
    env.run('rm -rf airy/frontend/css/')
    env.run('rm -rf airy/static/')


@task(default=True)
def all(production=False):
    dirs()
    venv(production=production)
    frontend(production=production)
