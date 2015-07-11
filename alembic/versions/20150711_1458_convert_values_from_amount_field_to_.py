"""Convert values from 'amount' field to time deltas

Revision ID: 294adccf8b5
Revises: 53979be7153
Create Date: 2015-07-11 14:58:58.514159

"""

# revision identifiers, used by Alembic.
revision = '294adccf8b5'
down_revision = '53979be7153'

import datetime
from sqlalchemy.sql import table, column
from alembic import op
import sqlalchemy as sa


def upgrade():
    conn = op.get_bind()
    times = table('time_entries',
        column('id', sa.Integer),
        column('amount', sa.Numeric(4, 2)),
        column('duration', sa.Interval))
    for row in conn.execute(times.select()):
        duration = datetime.timedelta(hours=float(row.amount))
        conn.execute(times.update().
            where(times.c.id == row.id).
            values(duration=duration))


def downgrade():
    pass
