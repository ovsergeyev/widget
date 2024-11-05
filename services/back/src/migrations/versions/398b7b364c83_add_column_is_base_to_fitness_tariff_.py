"""Add column is_base to fitness_tariff table

Revision ID: 398b7b364c83
Revises: baf97131d21c
Create Date: 2024-08-23 14:17:17.913059

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '398b7b364c83'
down_revision: Union[str, None] = 'baf97131d21c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('fitness_tariffs', sa.Column('is_base', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('fitness_tariffs', 'is_base')
    # ### end Alembic commands ###
