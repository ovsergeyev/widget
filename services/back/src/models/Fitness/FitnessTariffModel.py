from database import Base
from sqlalchemy.orm import mapped_column, Mapped
from typing import Optional
from datetime import date, time

class FitnessTariffModel(Base):
  __tablename__ = 'fitness_tariffs'

  id: Mapped[int] = mapped_column(primary_key=True)
  uid: Mapped[str]
  widget_id: Mapped[int]
  title: Mapped[str]
  description: Mapped[Optional[str]]
  is_monday: Mapped[bool]
  is_tuesday: Mapped[bool]
  is_wednesday: Mapped[bool]
  is_thursday: Mapped[bool]
  is_friday: Mapped[bool]
  is_saturday: Mapped[bool]
  is_sunday: Mapped[bool]
  is_holiday: Mapped[bool]
  type: Mapped[Optional[str]]
  count_adults: Mapped[int]
  count_children: Mapped[int]
  start_time: Mapped[time]
  end_time: Mapped[time]
  start_date: Mapped[Optional[date]]
  end_date: Mapped[Optional[date]]
  is_new: Mapped[bool]

  def __str__(self):
    return f"FitnessTariffModel #{self.id}"