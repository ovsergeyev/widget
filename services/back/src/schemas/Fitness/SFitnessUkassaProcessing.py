from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class SFitnessUkassaProcessing(BaseModel):
  uid: str
  widget_id: int
  amount: float
  payments1C: List[Dict]
  seats: List[Dict]
  description: str
  status: str
  club_id: str
  integration_code: str
  user_token: str
  created_at: datetime