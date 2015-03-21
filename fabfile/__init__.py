from fabric.api import env, local

import build  # flake8: noqa
import db  # flake8: noqa
import check  # flake8: noqa
try:
    import deploy  # flake8: noqa
except ImportError:
    pass

env.use_ssh_config = True
env.run = local
env.editor = "nano"
