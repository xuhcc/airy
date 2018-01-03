from fabric.api import task, local, cd, sudo, puts

from utils import vagrant, virtualenv


@task
def migrate():
    with virtualenv():
        local('alembic upgrade head')


@task
def auto(message):
    with virtualenv():
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
