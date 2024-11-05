from database import Base
from sqlalchemy.orm import mapped_column, Mapped
from typing import Optional
from datetime import time

class FitnessScheduleSegmentsModel(Base):
  __tablename__ = 'fitnes_schedule_segments'

  id: Mapped[int] = mapped_column(primary_key=True)
  title: Mapped[str]
  widget_id: Mapped[int]
  start_time: Mapped[time]
  end_time: Mapped[time]

  def __str__(self):
    return f"FitnessScheduleSegmentsModel #{self.id}"