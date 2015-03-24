"""Rename table for TimeEntry model

Revision ID: 1b91f4c7c1b
Revises: 28b17a6c5cf
Create Date: 2015-03-25 00:59:41.396413

"""

# revision identifiers, used by Alembic.
revision = '1b91f4c7c1b'
down_revision = '28b17a6c5cf'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.rename_table('times_entries', 'time_entries')


def downgrade():
    op.rename_table('time_entries', 'times_entries')
