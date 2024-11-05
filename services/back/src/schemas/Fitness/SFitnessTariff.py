from pydantic import BaseModel
from typing import Optional, List
from datetime import date, time

class SFitnessTariff(BaseModel):
  uid: str
  widget_id: int
  title: str
  description: Optional[str] = None
  is_monday: bool
  is_tuesday: bool
  is_wednesday: bool
  is_thursday: bool
  is_friday: bool
  is_saturday: bool
  is_sunday: bool
  is_holiday: bool
  type: Optional[str] = None
  count_adults: int
  count_children: int
  start_time: time
  end_time: time
  start_date: Optional[date] = None
  end_date: Optional[date] = None
  is_new: bool

  class Config:
    json_encoders = {
      time: lambda v: v.strftime('%H:%M')
    }

class SFitnessTariffGet(BaseModel):
  id: int
  uid: str
  widget_id: int
  title: str
  description: Optional[str] = None
  type: Optional[str] = None
  description: Optional[str] = None
  is_monday: bool
  is_tuesday: bool
  is_wednesday: bool
  is_thursday: bool
  is_friday: bool
  is_saturday: bool
  is_sunday: bool
  is_holiday: bool
  count_adults: int
  count_children: int
  start_time: time
  end_time: time
  start_date: Optional[date] = None
  end_date: Optional[date] = None
  is_new: bool

  class Config:
    json_encoders = {
      time: lambda v: v.strftime('%H:%M')
    }
