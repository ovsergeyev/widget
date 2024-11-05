from pydantic import BaseModel
from typing import Optional, List

# cart_object = {"cart_array":[{"purchase_id": "4170e088-3951-11ef-8d1a-00155d46f942", "count": 2}]}

class SFitnessCartElement(BaseModel):
  purchase_id: str
  count: int

class SFitnessCart(BaseModel):
  promocode: Optional[str]
  cart_array: List[SFitnessCartElement]