from database import Base
from sqlalchemy.orm import mapped_column, Mapped
from typing import Optional
from datetime import time

class FitnessUkassa(Base):
  __tablename__ = 'fitness_ukassa'

  id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
  widget_id: Mapped[int]
  account_id: Mapped[int]
  secret_key: Mapped[str]
  back_link: Mapped[Optional[str]]

  def __str__(self):
    return f"FitnessUkassaModel #{self.id}"