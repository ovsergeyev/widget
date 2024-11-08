"""Add column message_after_payment in fitnes config

Revision ID: baf97131d21c
Revises: 4b1d1eba490d
Create Date: 2024-08-22 18:03:29.855545

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'baf97131d21c'
down_revision: Union[str, None] = '4b1d1eba490d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('fitnes', sa.Column('message_after_payment', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('fitnes', 'message_after_payment')
    # ### end Alembic commands ###
