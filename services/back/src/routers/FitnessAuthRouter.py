from fastapi import APIRouter
# from datetime import datetime
import base64
import requests
from urllib.parse import quote
from pydantic import BaseModel
from typing import Optional
from dao.FitnesDAO import FitnesDAO
from schemas.Fitness.SFitnes import SFitnes
import json
from services.ResponseLogger import ResponseLogger

router = APIRouter(
  prefix="/fit-auth",
  tags=["Auth 1С"]
)

class SAuth(BaseModel):
  phone: str
  password: str

class SConfirm(BaseModel):
  phone: str
  confirmation_code: Optional[str] = None

class SSetPassword(BaseModel):
  phone: str
  pass_token: str
  password: str

class SRegAndAuth(BaseModel):
  phone: str
  pass_token: str
  password: str
  name: str
  second_name: str
  last_name: str
  email: str
  birthday: str

async def get_config_by_integration_code(integration_code):
  config = await FitnesDAO.find_one_or_none(integration_code = integration_code)
  return SFitnes(**config)

@router.post("/auth_client")
async def auth_client(integration_code: str, auth_data: SAuth):
  config = await get_config_by_integration_code(integration_code)
  API_URL = config.api_url
  API_KEY = config.api_key
  USER = config.username
  PASSWORD = config.password
  url = f"{API_URL}auth_client/"
  print('url', url)
  payload = json.dumps({
    "phone": auth_data.phone,
    "password": auth_data.password,
  })
  credentials = f'{USER}:{PASSWORD}'.encode('utf-8')
  auth_token = base64.b64encode(credentials).decode('utf-8')
  headers = {
    'apikey': API_KEY,
    'Authorization': f"Basic {auth_token}"
  }

  response = requests.request("POST", url, headers=headers, data=payload)
  ResponseLogger.log_response('auth_client', json.loads(payload), response)

  return response.json()

@router.post("/confirm_phone")
async def confirm_phone(integration_code: str, confirm_data: SConfirm):
  config = await get_config_by_integration_code(integration_code)
  API_URL = config.api_url
  API_KEY = config.api_key
  USER = config.username
  PASSWORD = config.password
  url = f"{API_URL}confirm_phone/"
  print('url', url)
  payload = {
    "phone": confirm_data.phone,
    "auth_type": "sms"
  }
  if confirm_data.confirmation_code:
    payload['confirmation_code'] = confirm_data.confirmation_code

  payload_json = json.dumps(payload)
  credentials = f'{USER}:{PASSWORD}'.encode('utf-8')
  auth_token = base64.b64encode(credentials).decode('utf-8')
  headers = {
    'apikey': API_KEY,
    'Authorization': f"Basic {auth_token}"
  }

  response = requests.request("POST", url, headers=headers, data=payload_json)
  ResponseLogger.log_response('confirm_phone', json.loads(payload_json), response)

  return response.json()

@router.post("/password_set")
async def password_set(integration_code: str, set_password_data: SSetPassword):
  config = await get_config_by_integration_code(integration_code)
  API_URL = config.api_url
  API_KEY = config.api_key
  USER = config.username
  PASSWORD = config.password
  url = f"{API_URL}password/"
  print('url', url)
  payload = json.dumps({
    "phone": set_password_data.phone,
    "pass_token": set_password_data.pass_token,
    "password": set_password_data.password
  })

  credentials = f'{USER}:{PASSWORD}'.encode('utf-8')
  auth_token = base64.b64encode(credentials).decode('utf-8')
  headers = {
    'apikey': API_KEY,
    'Authorization': f"Basic {auth_token}"
  }

  response = requests.request("POST", url, headers=headers, data=payload)
  ResponseLogger.log_response('password', json.loads(payload), response)

  return response.json()

@router.post("/reg_and_auth")
async def password_set(integration_code: str, reg_and_auth_data: SRegAndAuth):
  config = await get_config_by_integration_code(integration_code)
  API_URL = config.api_url
  API_KEY = config.api_key
  USER = config.username
  PASSWORD = config.password
  url = f"{API_URL}reg_and_auth_client/"
  print('url', url)
  payload = json.dumps({
    "phone": reg_and_auth_data.phone,
    "pass_token": reg_and_auth_data.pass_token,
    "password": reg_and_auth_data.password,
    "name": reg_and_auth_data.name,
    "second_name": reg_and_auth_data.second_name,
    "last_name": reg_and_auth_data.last_name,
    "email": reg_and_auth_data.email,
    "birthday": reg_and_auth_data.birthday
  })

  credentials = f'{USER}:{PASSWORD}'.encode('utf-8')
  auth_token = base64.b64encode(credentials).decode('utf-8')
  headers = {
    'apikey': API_KEY,
    'Authorization': f"Basic {auth_token}"
  }

  response = requests.request("POST", url, headers=headers, data=payload)
  ResponseLogger.log_response('reg_and_auth_client', json.loads(payload), response)

  return response.json()

@router.get("/get_user")
async def get_user(integration_code: str, user_token: str):
  config = await get_config_by_integration_code(integration_code)
  API_URL = config.api_url
  API_KEY = config.api_key
  USER = config.username
  PASSWORD = config.password

  url = f'{API_URL}client'
  payload = {}
  credentials = f'{USER}:{PASSWORD}'.encode('utf-8')
  auth_token = base64.b64encode(credentials).decode('utf-8')
  headers = {
    'apikey': API_KEY,
    'Authorization': f"Basic {auth_token}",
    'usertoken': user_token
  }

  response = requests.request("GET", url, headers=headers, data=payload)
  ResponseLogger.log_response('client', payload, response)

  return response.json()