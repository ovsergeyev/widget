from database import Base
from sqlalchemy import String
from sqlalchemy.orm import mapped_column, Mapped
from typing import Optional
from datetime import time
import json

class FitnessUkassaProcessing(Base):
  __tablename__ = 'fitness_ukassa_processing'

  uid: Mapped[str] = mapped_column(primary_key=True)
  widget_id: Mapped[int]
  amount: Mapped[float]
  payments1C: Mapped[str]
  seats: Mapped[str]
  description: Mapped[str]
  status: Mapped[str]
  integration_code: Mapped[str]
  user_token: Mapped[str]
  club_id: Mapped[str]

  def __str__(self):
    return f"FitnessUkassaProcessingModel #{self.id}"