from fabric.api import env

import build  # noqa
import db  # noqa
import check  # noqa

env.use_ssh_config = True
