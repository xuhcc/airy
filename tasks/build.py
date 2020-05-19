from invoke import task


@task(aliases=('r',))
def requirements(ctx):
    ctx.run('poetry install')


@task
def dirs(ctx):
    ctx.run('mkdir -p logs')


@task
def frontend(ctx, rebuild=True):
    ctx.run('npm install')
    if rebuild:
        ctx.run('npm rebuild node-sass')
    grunt(ctx)


@task
def grunt(ctx):
    ctx.run('npm run grunt build', pty=True)


@task
def watch(ctx):
    ctx.run('npm run grunt watch')


@task
def clean(ctx):
    ctx.run('find . -name \'*.pyc\' -delete')
    ctx.run('npm run grunt clean')


@task(default=True)
def all(ctx):
    requirements(ctx)
    dirs(ctx)
    frontend(ctx)
