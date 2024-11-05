"""Add metrica code

Revision ID: 436fc4d3adf8
Revises: eb1db526e6c4
Create Date: 2024-09-04 16:04:54.666262

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '436fc4d3adf8'
down_revision: Union[str, None] = 'eb1db526e6c4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('fitnes', sa.Column('metrica_code', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('fitnes', 'metrica_code')
    # ### end Alembic commands ###