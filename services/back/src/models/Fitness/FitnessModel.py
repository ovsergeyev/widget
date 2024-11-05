from database import Base
from sqlalchemy.orm import mapped_column, Mapped
from typing import Optional

class FitnessModel(Base):
  __tablename__ = 'fitnes'

  id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
  user_id: Mapped[int]
  title: Mapped[str]
  description: Mapped[Optional[str]]
  message_after_payment: Mapped[Optional[str]]
  api_url: Mapped[str]
  api_key: Mapped[Optional[str]]
  club_id: Mapped[str]
  service_id: Mapped[str]
  username: Mapped[str]
  password: Mapped[str]
  integration_code: Mapped[str]
  metrica_code: Mapped[Optional[str]]

  def __str__(self):
    return f"FitnessModel #{self.id}"