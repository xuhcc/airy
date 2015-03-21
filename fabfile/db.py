from fabric.api import env, task, prefix, local


@task
def migrate():
    with prefix(". venv/bin/activate"):
        env.run("alembic upgrade head")


@task
def auto(message):
    with prefix('. venv/bin/activate'):
        local('alembic revision --autogenerate -m "{0}"'.format(message))
