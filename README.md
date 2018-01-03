# airy

Time tracker

[![Build Status](https://travis-ci.org/xuhcc/airy.svg?branch=master)](https://travis-ci.org/xuhcc/airy)

Requirements:

* python 3.5+
* nodejs 8+
* postgresql

## Development

Requirements:

* pipenv
* fabric
* virtualbox
* vagrant

Create configuration file:

```
cp env.example .env
```

Prepare environment and install packages:

```
vagrant up
fab build
```

Start watcher:

```
fab build.watch
```

Start server:

```
pipenv run honcho start
```

Login at `http://localhost:8085`.  
Default password: `password`.
