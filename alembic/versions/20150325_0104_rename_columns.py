"""Rename columns

Revision ID: 27ba8807426
Revises: 1b91f4c7c1b
Create Date: 2015-03-25 01:04:36.657762

"""

# revision identifiers, used by Alembic.
revision = '27ba8807426'
down_revision = '1b91f4c7c1b'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.alter_column('tasks', 'created', new_column_name='created_at')
    op.alter_column('tasks', 'updated', new_column_name='updated_at')
    op.alter_column('time_entries', 'added', new_column_name='added_at')
    op.alter_column('reports', 'created', new_column_name='created_at')


def downgrade():
    op.alter_column('tasks', 'created_at', new_column_name='created')
    op.alter_column('tasks', 'updated_at', new_column_name='updated')
    op.alter_column('time_entries', 'added_at', new_column_name='added')
    op.alter_column('reports', 'created_at', new_column_name='created')
