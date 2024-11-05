from pydantic import BaseModel
from typing import Optional, List
from datetime import time

class SFitnessCart(BaseModel):
  count: int
  purchase_id: str

class SFitnessPaymentList(BaseModel):
  type: str
  amount: float

class SFitnessPayment(BaseModel):
  transaction_id: str
  use_bank: str
  promocode: Optional[str]
  club_id: str
  integration_code: str
  user_token: str
  cart: List[SFitnessCart]
  payment_list: List[SFitnessPaymentList]