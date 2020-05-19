from invoke import task

from tasks.utils import get_vagrant_context


@task(default=True)
def migrate(ctx):
    ctx.run('poetry run alembic upgrade head')


@task(aliases=('mkmgr', 'mm'))
def make_migration(ctx, message):
    ctx.run(f'poetry run '
            f'alembic revision --autogenerate -m "{message}"')


@task
def backup(ctx, database='airy'):
    vagrant_ctx = get_vagrant_context(ctx)
    with vagrant_ctx.cd('/vagrant/vagrant'):
        # Bug https://github.com/pyinvoke/invoke/issues/459
        vagrant_ctx.run(
            f'sudo pg_dump -Fc -U postgres {database} > database.backup')
        print('Database backup created.')


@task
def restore(ctx, database='airy'):
    vagrant_ctx = get_vagrant_context(ctx)
    with vagrant_ctx.cd('/vagrant/vagrant'):
        vagrant_ctx.run(
            f'sudo pg_restore -U postgres -d {database} database.backup')
        print('Database restored.')
