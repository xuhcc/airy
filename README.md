# airy

Time tracker

[![Build Status](https://travis-ci.org/xuhcc/airy.svg?branch=master)](https://travis-ci.org/xuhcc/airy)

Requirements:

* python 3.5+
* nodejs 8+
* postgresql

## Development

Requirements:

* virtualenv
* fabric
* virtualbox
* vagrant

Prepare environment and install packages:

```
fab build
cp airy/settings.py.example airy/settings.py
vagrant up
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

Login at `http://localhost:8085`.  
Default password: `password`.
