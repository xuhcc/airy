from fabric.api import env, local

import build
import db
import check
try:
    import deploy
except ImportError:
    pass

env.use_ssh_config = True
env.run = local
env.editor = "nano"
