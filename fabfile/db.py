from fabric.api import env, task, prefix


@task
def upgrade():
    with prefix(". venv/bin/activate"):
        env.run("alembic upgrade head")
