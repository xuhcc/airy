import os.path
from contextlib import contextmanager
import random

from fabric.api import env, local, run, sudo, settings, get, put


@contextmanager
def remotely(use_sudo=False):
    env.run = sudo if use_sudo else run
    yield
    env.run = local


def edit(file, processor=None):
    owner, group = sudo("ls -l {0}".format(file)).split()[2:4]
    tmp_file = os.path.join(
        "/tmp",
        os.path.basename(file) + "." + str(random.random())[2:])
    with settings(sudo_user="root"):
        sudo("cp {0} {1}".format(file, tmp_file))
        get(tmp_file, tmp_file)
        if processor is not None:
            processor(tmp_file)
        local("{0} {1}".format(env.editor, tmp_file))
        put(tmp_file, file, use_sudo=True)
        # Restore ownership
        sudo("chown {0}:{1} {2}".format(owner, group, file))
