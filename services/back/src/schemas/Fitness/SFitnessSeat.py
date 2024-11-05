from pydantic import BaseModel

class SFitnessSeat(BaseModel):
  integration_code: str
  appointment_id: str
  user_token: str
  count: int

class SFitnessSetSeat(BaseModel):
  appointment_id: str
  count: int