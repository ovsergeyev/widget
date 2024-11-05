from database import Base
from sqlalchemy.orm import mapped_column, Mapped
from typing import Optional
from datetime import time

class FitnessSeatModel(Base):
  __tablename__ = 'fitness_seats'

  id: Mapped[int] = mapped_column(primary_key=True)
  integration_code: Mapped[str]
  appointment_id: Mapped[str]
  count: Mapped[int]
  user_token: Mapped[str]

  def __str__(self):
    return f"FitnessSeatModel #{self.id}"