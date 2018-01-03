airy_pg_user:
  postgres_user.present:
    - name: {{ pillar['postgresql']['user'] }}
    - createdb: true
    - password: {{ pillar['postgresql']['password'] }}
    - require:
      - service: postgresql_service

airy_pg_database:
  postgres_database.present:
    - name: {{ pillar['postgresql']['database'] }}
    - encoding: UTF8
    - lc_ctype: en_US.UTF8
    - lc_collate: en_US.UTF8
    - template: template0
    - owner: {{ pillar['postgresql']['user'] }}
    - require:
      - postgres_user: airy_pg_user
