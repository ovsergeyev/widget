from fastapi import APIRouter
from config import settings
from datetime import datetime
import base64
import requests
from urllib.parse import quote
from services.ResponseLogger import ResponseLogger

router = APIRouter(
  prefix="/catalog",
  tags=["Каталог"]
)

@router.get("/price_list")
async def book_dates():
  url = f"{settings.API_URL}price_list?club_id={settings.CLUB_ID}"
  payload = {}
  credentials = f'{settings.USER}:{settings.PASSWORD}'.encode('utf-8')
  auth_token = base64.b64encode(credentials).decode('utf-8')
  headers = {
    'apikey': settings.API_KEY,
    'Authorization': f"Basic {auth_token}"
  }

  response = requests.request("GET", url, headers=headers, data=payload)
  ResponseLogger.log_response('price_list', payload, response)

  return response.json()