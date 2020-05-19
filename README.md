# airy

Time tracker.

Requirements:

* python 3.6+
* nodejs 12+
* postgresql

## Development

Requirements:

* [poetry](https://python-poetry.org)
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
poetry run honcho start
```

Login at `http://localhost:8085`.  
Default password: `password`.
