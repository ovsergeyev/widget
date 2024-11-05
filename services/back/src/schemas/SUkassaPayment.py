from pydantic import BaseModel
from typing import Optional, List, Dict

class SUkassaPayment(BaseModel):
  user_token: str
  amount: float
  # return_url: str
  description: str
  payments1C: List[Dict]
  seats: List[Dict]
