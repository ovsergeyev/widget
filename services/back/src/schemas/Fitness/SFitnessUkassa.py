from pydantic import BaseModel
from typing import Optional, List
from datetime import time

class SFitnessUkassa(BaseModel):
  widget_id: int
  account_id: int
  secret_key: str
  back_link: Optional[str]

class SFitnessUkassaGet(BaseModel):
  id: int
  widget_id: int
  account_id: int
  secret_key: str
  back_link: Optional[str]