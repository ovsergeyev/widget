from pydantic import BaseModel
from typing import Optional, List
from datetime import time

class SFitnessFictitiousUser(BaseModel):
  user_token: str
  widget_id: int
