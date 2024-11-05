from fastapi import APIRouter
from config import settings
from datetime import datetime
import base64
import requests
from pydantic import BaseModel
from services.ResponseLogger import ResponseLogger

router = APIRouter(
  prefix="/group_classes",
  tags=["Групповые занятия"]
)

class SDates(BaseModel):
  start_date: datetime
  end_date: datetime

@router.post("/classes")
async def classes(dates: SDates):
  proc_start_date = dates.start_date.isoformat().replace('T', ' ')
  proc_end_date = dates.end_date.isoformat().replace('T', ' ')
  url = f"{settings.API_URL}classes?club_id={settings.CLUB_ID}&start_date={proc_start_date}&end_date={proc_end_date}"
  # url = quote(url, safe=':/?=&')
  # print('url', url)
  payload = {}
  credentials = f'{settings.USER}:{settings.PASSWORD}'.encode('utf-8')
  auth_token = base64.b64encode(credentials).decode('utf-8')
  headers = {
    'apikey': settings.API_KEY,
    'Authorization': f"Basic {auth_token}"
  }

  response = requests.request("GET", url, headers=headers, data=payload)
  ResponseLogger.log_response('classes', payload, response)

  return response.json()