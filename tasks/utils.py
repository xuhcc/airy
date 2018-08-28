from fabric.connection import Connection


def get_vagrant_context(ctx):
    ctx.run('vagrant up')
    # Parse SSH config
    ssh_config_str = ctx.run(
        'vagrant ssh-config',
        hide='out',
        echo=False,
    ).stdout
    ssh_config = {}
    for line in ssh_config_str.splitlines()[1:]:
        if not line.strip():
            continue
        key, value = line.strip().split(' ', 2)
        ssh_config[key] = value
    return Connection(
        host=ssh_config['HostName'],
        port=ssh_config['Port'],
        user=ssh_config['User'],
        connect_kwargs={
            'key_filename': ssh_config['IdentityFile'].strip('"'),
        })
