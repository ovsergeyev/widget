from pydantic import BaseModel
from typing import Optional, List
from datetime import time

class SFitnessScheduleSegment(BaseModel):
  title: str
  widget_id: int
  start_time: time
  end_time: time

  class Config:
    json_encoders = {
      time: lambda v: v.strftime('%H:%M')
    }

class SFitnessScheduleSegmentGet(BaseModel):
  id: int
  title: str
  start_time: time
  end_time: time

  class Config:
    json_encoders = {
      time: lambda v: v.strftime('%H:%M')
    }