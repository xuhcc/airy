# airy

Time tracker

[![Build Status](https://travis-ci.org/xuhcc/airy.svg?branch=master)](https://travis-ci.org/xuhcc/airy)

Requirements:

* python 3.6+
* nodejs 12+
* postgresql

## Development

Requirements:

* pipenv
* pyinvoke
* virtualbox
* vagrant

Create configuration file:

```
cp env.example .env
```

Prepare environment and install packages:

```
vagrant up
inv build
```

Start watcher:

```
inv build.watch
```

Start server:

```
pipenv run honcho start
```

Login at `http://localhost:8085`.  
Default password: `password`.
