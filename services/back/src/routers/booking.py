from fastapi import APIRouter
from config import settings
from datetime import datetime
import base64
import requests
from urllib.parse import quote
from services.ResponseLogger import ResponseLogger

router = APIRouter(
  prefix="/booking",
  tags=["Запись в салон красоты"]
)

@router.post("/book_dates")
async def book_dates(start_date: datetime, end_date: datetime):
  proc_start_date = start_date.isoformat()[:-2].replace(':', '').replace('-', '')
  proc_end_date = end_date.isoformat()[:-2].replace(':', '').replace('-', '')
  url = f"{settings.API_URL}book_dates?club_id={settings.CLUB_ID}&start_date={proc_start_date}&end_date={proc_end_date}"
  url = quote(url, safe=':/?=&')
  print('url', url)
  print(url)
  payload = {}
  credentials = f'{settings.USER}:{settings.PASSWORD}'.encode('utf-8')
  auth_token = base64.b64encode(credentials).decode('utf-8')
  headers = {
    'apikey': settings.API_KEY,
    'Authorization': f"Basic {auth_token}"
  }

  response = requests.request("GET", url, headers=headers, data=payload)
  ResponseLogger.log_response('book_dates', payload, response)

  return response.json()