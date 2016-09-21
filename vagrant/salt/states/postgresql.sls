postgresql:
  pkg:
    - installed

postgresql.conf:
  file.managed:
    - name: /etc/postgresql/9.4/main/postgresql.conf
    - source: salt://postgresql/postgresql.conf
    - user: postgres
    - group: postgres
    - mode: 644
    - require:
      - pkg: postgresql

pg_hba.conf:
  file.managed:
    - name: /etc/postgresql/9.4/main/pg_hba.conf
    - source: salt://postgresql/pg_hba.conf
    - user: postgres
    - group: postgres
    - mode: 644
    - require:
      - pkg: postgresql

postgresql_service:
  service.running:
    - name: postgresql
    - enable: true
    - watch:
      - file: postgresql.conf
      - file: pg_hba.conf
    - require:
      - pkg: postgresql
