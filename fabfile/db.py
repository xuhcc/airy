from fabric.api import env, task, prefix, local, cd, sudo, puts

from utils import vagrant


@task
def migrate():
    with prefix(". venv/bin/activate"):
        env.run("alembic upgrade head")


@task
def auto(message):
    with prefix('. venv/bin/activate'):
        local('alembic revision --autogenerate -m "{0}"'.format(message))


@task
def backup(database='airy'):
    with vagrant(), cd('/vagrant/vagrant'):
        sudo('pg_dump -Fc -U postgres {} > database.backup'.format(
            database))
        puts('Database backup created.')


@task
def restore(database='airy'):
    with vagrant(), cd('/vagrant/vagrant'):
        sudo('pg_restore -U postgres -d {} database.backup'.format(
            database))
        puts('Database restored.')
