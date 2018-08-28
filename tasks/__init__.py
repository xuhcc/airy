from invoke import Collection

from tasks import build, check, db

ns = Collection()
ns.add_collection(build)
ns.add_collection(check)
ns.add_collection(db)
