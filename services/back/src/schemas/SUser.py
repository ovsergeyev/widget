from pydantic import BaseModel
from typing import Optional

class SUser(BaseModel):
  username: str
  password: str
  role: Optional[str] = 'client'

class SUserLogin(BaseModel):
  username: str
  password: str

class SUserUpdate(BaseModel):
  id: int
  username: Optional[str] = None
  role: Optional[str] = 'client'
  is_active: Optional[bool] = None
  is_deleted: Optional[bool] = None

class SUserGet(BaseModel):
  id: int
  username: Optional[str]
  role: Optional[str]
  is_active: Optional[bool] = None
  is_deleted: Optional[bool] = None


