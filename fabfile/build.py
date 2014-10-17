from fabric.api import env, task, settings, prefix


@task
def logdir():
    env.run("mkdir -p logs")


@task
def venv():
    with settings(warn_only=True):
        # Test if requirements.txt is newer then the virtual environment
        result = env.run("test requirements.txt -ot venv/bin/activate")
    if result.failed:
        env.run("virtualenv venv")
        with prefix(". venv/bin/activate"):
            env.run("pip install -r requirements.txt --upgrade")
        env.run("touch venv/bin/activate")


@task
def frontend():
    env.run("npm install")
    env.run("node_modules/bower/bin/bower install")
    env.run("node_modules/grunt-cli/bin/grunt concat uglify cssmin")


@task(default=True)
def all():
    logdir()
    venv()
    frontend()
