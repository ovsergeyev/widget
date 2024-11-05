from database import Base
from sqlalchemy.orm import mapped_column, Mapped
from typing import Optional
from datetime import time

class FitnessFictitiousUserModel(Base):
  __tablename__ = 'fitness_fictitious_users'

  id: Mapped[int] = mapped_column(primary_key=True)
  widget_id: Mapped[int]
  user_token: Mapped[str]

  def __str__(self):
    return f"fitness_fictitious_users #{self.id}"