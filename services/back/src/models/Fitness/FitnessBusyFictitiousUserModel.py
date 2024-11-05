from database import Base
from sqlalchemy.orm import mapped_column, Mapped
from typing import Optional
from datetime import datetime
from sqlalchemy import DateTime

class FitnessBusyFictitiousUserModel(Base):
  __tablename__ = 'fitness_busy_fictitious_users'

  id: Mapped[int] = mapped_column(primary_key=True)
  widget_id: Mapped[int]
  user_token: Mapped[str]
  appointment_id: Mapped[str]

  def __str__(self):
    return f"fitness_busy_fictitious_users #{self.id}"