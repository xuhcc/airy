postgresql_repo:
  pkgrepo.managed:
    - name: deb http://apt.postgresql.org/pub/repos/apt/ stretch-pgdg main
    - file: /etc/apt/sources.list.d/pgdg.list
    - key_url: https://www.postgresql.org/media/keys/ACCC4CF8.asc

postgresql_package:
  pkg.installed:
    - name: postgresql-10
    - require:
      - pkgrepo: postgresql_repo

postgresql_conf:
  file.managed:
    - name: /etc/postgresql/10/main/postgresql.conf
    - source: salt://postgresql/postgresql.conf
    - user: postgres
    - group: postgres
    - mode: 644
    - require:
      - pkg: postgresql_package

postgresql_hba_conf:
  file.managed:
    - name: /etc/postgresql/10/main/pg_hba.conf
    - source: salt://postgresql/pg_hba.conf
    - user: postgres
    - group: postgres
    - mode: 644
    - require:
      - pkg: postgresql_package

postgresql_service:
  service.running:
    - name: postgresql
    - enable: true
    - watch:
      - file: postgresql_conf
      - file: postgresql_hba_conf
    - require:
      - pkg: postgresql_package
