from pydantic import BaseModel
from typing import Optional, List

class SFitnessBusyFictitiousUser(BaseModel):
  user_token: str
  widget_id: int
  appointment_id: str
