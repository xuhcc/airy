from invoke import task


@task
def js(ctx):
    ctx.run('npm run grunt check:js --silent')


@task
def css(ctx):
    ctx.run('npm run grunt check:css --silent')


@task
def html(ctx):
    ctx.run('npm run grunt check:html --silent')


@task
def py_style(ctx):
    ctx.run('pipenv run flake8 --max-complexity=8 tasks')
    ctx.run('pipenv run flake8 --max-complexity=10 airy')
    ctx.run('pipenv run flake8 --max-complexity=8 alembic/env.py')


@task
def py_security(ctx):
    ctx.run('pipenv run safety check --bare')
    ctx.run('pipenv run bandit -r -x tests,settings airy')


@task
def py_types(ctx):
    ctx.run('pipenv run mypy airy')


@task
def py_unit(ctx):
    ctx.run(
        'pipenv run '
        'py.test -v -x --pdb '
        '--cov airy '
        '--cov-config .coveragerc '
        'airy/tests',
        pty=True)


@task
def frontend(ctx):
    js(ctx)
    css(ctx)
    html(ctx)


@task
def backend(ctx):
    py_style(ctx)
    py_security(ctx)
    py_types(ctx)
    py_unit(ctx)


@task(default=True)
def all(ctx):
    frontend(ctx)
    backend(ctx)
