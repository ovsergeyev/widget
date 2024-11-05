from pydantic import BaseModel
from typing import Optional, List
from schemas.Fitness.SFitnessScheduleSegment import SFitnessScheduleSegmentGet
from schemas.Fitness.SFitnessTariff import SFitnessTariffGet
from schemas.Fitness.SFitnessUkassa import SFitnessUkassaGet
from schemas.Fitness.SFitnessPromocode import SFitnessPromocode

class SFitnes(BaseModel):
  user_id: int
  title: str
  metrica_code: Optional[str] = None
  description: Optional[str] = None
  message_after_payment: Optional[str] = None
  api_url: str
  api_key: Optional[str] = None
  club_id: str
  service_id: str
  username: str
  password: Optional[str] = None

class SFitnesGet(BaseModel):
  id: int
  user_id: int
  title: str
  metrica_code: Optional[str] = None
  description: Optional[str] = None
  message_after_payment: Optional[str] = None
  api_url: str
  api_key: str
  club_id: str
  service_id: str
  username: str
  schedule_segments: List[SFitnessScheduleSegmentGet]
  tariffs: List[SFitnessTariffGet]
  promocodes: List[SFitnessPromocode]
  payment_gateways: List[SFitnessUkassaGet]
  integration_code: str

class SFitnesGetWidget(BaseModel):
  title: str
  metrica_code: str
  description: Optional[str] = None
  message_after_payment: Optional[str] = None
  schedule_segments: List[SFitnessScheduleSegmentGet]
  tariffs: List[SFitnessTariffGet]
  promocodes: List[SFitnessPromocode]


