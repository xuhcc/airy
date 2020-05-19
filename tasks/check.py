from invoke import task


@task
def js(ctx):
    ctx.run('npm run eslint --silent')
    ctx.run('npm run karma --silent', pty=True)


@task
def css(ctx):
    ctx.run('npm run stylelint --silent')


@task
def html(ctx):
    ctx.run('npm run htmlhint --silent')


@task
def py_style(ctx):
    ctx.run('poetry run flake8 --max-complexity=8 tasks')
    ctx.run('poetry run flake8 --max-complexity=10 airy')
    ctx.run('poetry run flake8 --max-complexity=8 alembic/env.py')


@task
def py_security(ctx):
    ctx.run('poetry run safety check --bare')
    ctx.run('poetry run bandit -c bandit.yaml -r airy')


@task
def py_types(ctx):
    ctx.run('poetry run mypy airy')


@task
def py_unit(ctx, debug=True, select=None):
    args = []
    if debug:
        args += ['--maxfail 3', '--pdb']
    if select:
        args += ['-k ' + select]
    else:
        args += ['--cov airy', '--cov-config .coveragerc']
    ctx.run(
        f'poetry run pytest airy/tests {" ".join(args)}',
        pty=True,
    )


@task
def frontend(ctx):
    js(ctx)
    css(ctx)
    html(ctx)


@task(aliases=('python', 'py'))
def backend(ctx):
    py_style(ctx)
    py_security(ctx)
    py_types(ctx)
    py_unit(ctx)


@task(default=True)
def all(ctx):
    frontend(ctx)
    backend(ctx)
