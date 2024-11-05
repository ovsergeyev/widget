"""Add column back_link to fitness_ukassa table

Revision ID: cf510df56c1a
Revises: c21c3e84c571
Create Date: 2024-08-21 10:50:38.784168

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cf510df56c1a'
down_revision: Union[str, None] = 'c21c3e84c571'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('fitness_ukassa', sa.Column('back_link', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('fitness_ukassa', 'back_link')
    # ### end Alembic commands ###
