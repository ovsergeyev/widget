from database import Base
from sqlalchemy.orm import mapped_column, Mapped
from typing import Optional
from datetime import date, time

class FitnessPromocodeModel(Base):
  __tablename__ = 'fitness_promocodes'

  id: Mapped[int] = mapped_column(primary_key=True)
  widget_id: Mapped[int]
  title: Mapped[str]
  promocode: Mapped[str]
  start_date: Mapped[Optional[date]]
  end_date: Mapped[Optional[date]]
  start_time: Mapped[Optional[time]]
  end_time: Mapped[Optional[time]]
  auto_apply: Mapped[bool]

  def __str__(self):
    return f"FitnessPromocodeModel #{self.id}"