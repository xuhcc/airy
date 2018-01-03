from contextlib import contextmanager
import os

from fabric.api import env, local, settings, prefix


@contextmanager
def vagrant():
    local('vagrant up')

    # Parse SSH config
    ssh_config_str = local('vagrant ssh-config', capture=True)
    ssh_config = {}
    for line in ssh_config_str.splitlines():
        key, value = line.strip().split()
        ssh_config[key] = value
    host_string = '{0}@{1}:{2}'.format(
        ssh_config['User'],
        ssh_config['HostName'],
        ssh_config['Port'])

    with settings(host_string=host_string,
                  key_filename=ssh_config['IdentityFile'].strip('"'),
                  disable_known_hosts=True):
        yield


@contextmanager
def virtualenv():
    venv_path = os.path.relpath('venv', env.lcwd)
    if not os.path.exists(venv_path):
        local('virtualenv -p /usr/bin/python3 {}'.format(venv_path))
    activate_cmd = '. ' + os.path.join(venv_path, 'bin/activate')
    with prefix(activate_cmd):
        yield
