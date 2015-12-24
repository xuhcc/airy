# airy

Time tracker

## Requirements

* python 3
* virtualenv
* nodejs 5+
* fabric

## Development

Prepare environment and install packages:

```
fab build
cp airy/settings.py.dist airy/settings.py
```

Start watcher:

```
fab build.watch
```

Start server:

```
. venv/bin/activate
python airy
```
