# airy

Time tracker

[![Build Status](https://travis-ci.org/xuhcc/airy.svg?branch=master)](https://travis-ci.org/xuhcc/airy)

Requirements:

* python 3
* nodejs 5+
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
cp airy/settings.py.dist airy/settings.py
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
