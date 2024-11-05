"""Add fitness_busy_fictitious_users

Revision ID: b667923ef851
Revises: 42477e011250
Create Date: 2024-08-19 17:34:43.209480

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b667923ef851'
down_revision: Union[str, None] = '42477e011250'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('fitness_busy_fictitious_users', sa.Column('recording', sa.DateTime(), nullable=False))
    op.drop_column('fitness_busy_fictitious_users', 'class_datetime')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('fitness_busy_fictitious_users', sa.Column('class_datetime', postgresql.TIMESTAMP(), autoincrement=False, nullable=False))
    op.drop_column('fitness_busy_fictitious_users', 'recording')
    # ### end Alembic commands ###
