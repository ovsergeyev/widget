from pydantic import BaseModel
from typing import Optional
from datetime import date, time

# class SFitnessPromocodeCreate(BaseModel):
#   widget_id: int
#   title: str
#   promocode: str
#   start_date: Optional[date] = None
#   end_date: Optional[date] = None
#   start_time: Optional[time] = None
#   end_time: Optional[time] = None
#   auto_apply: bool

#   class Config:
#     json_encoders = {
#       time: lambda v: v.strftime('%H:%M')
#     }

class SFitnessPromocode(BaseModel):
  id: Optional[int] = None
  widget_id: int
  title: str
  promocode: str
  start_date: Optional[date] = None
  end_date: Optional[date] = None
  start_time: Optional[time] = None
  end_time: Optional[time] = None
  auto_apply: bool

  class Config:
    json_encoders = {
      time: lambda v: v.strftime('%H:%M')
    }


