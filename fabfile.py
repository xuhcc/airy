from fabric.api import local, settings, prefix, puts


def venv():
    with settings(warn_only=True):
        # Test if requirements.txt is newer then virtual environment
        result = local("test requirements.txt -ot venv/bin/activate")
    if result.failed:
        local("virtualenv venv")
        with prefix(". venv/bin/activate"):
            local("pip install -r requirements.txt --upgrade")
        local("touch venv/bin/activate")
    puts("Virtual environment is up to date.")


def frontend():
    local("npm install")
    local("node_modules/bower/bin/bower install")
    local("node_modules/grunt-cli/bin/grunt copy")


def test():
    local("node_modules/grunt-cli/bin/grunt jshint csslint")
    with prefix(". venv/bin/activate"):
        local("pep8 fabfile.py")
        local("pep8 airy")


def upgrade():
    with prefix(". venv/bin/activate"):
        local("alembic upgrade head")
