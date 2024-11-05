from database import Base
from sqlalchemy.orm import mapped_column, Mapped

class UserModel(Base):
  __tablename__ = 'users'

  id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
  username: Mapped[str]
  role: Mapped[str]
  hashed_password: Mapped[str]
  is_active: Mapped[bool]
  is_deleted: Mapped[bool]

  def __str__(self):
    return f"UserModel #{self.id}"