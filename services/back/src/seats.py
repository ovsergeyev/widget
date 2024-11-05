import asyncio
# from schemas.Fitness.SFitnessFictitiousUser import SFitnessFictitiousUser
from schemas.Fitness.SFitnessBusyFictitiousUser import SFitnessBusyFictitiousUser
# from schemas.Fitness.SFitnes import SFitnesGet
from schemas.Fitness.SFitnessSeat import SFitnessSeat
from dao.FitnessBusyFictitiousUsersDAO import FitnessBusyFictitiousUsersDAO
from dao.FitnessFictitiousUsersDAO import FitnessFictitiousUsersDAO
from dao.FitnesDAO import FitnesDAO
from datetime import datetime
import random
# from pydantic import BaseModel
import base64
import requests
import json
from services.ResponseLogger import ResponseLogger

# class SSeat(BaseModel):
#   integration_code: str
#   appointment_id: str
#   user_token: str

async def get_config_by_integration_code(integration_code):
  config = await FitnesDAO.find_one_or_none(integration_code = integration_code)
  return config

async def add_row(payload: SFitnessBusyFictitiousUser):
  # row = await FitnessFictitiousUsersDAO.find_one_or_none(user_token = payload.user_token)
  # if not row:
  result = await FitnessBusyFictitiousUsersDAO.add(payload.model_dump(exclude_none=True))
  print(result)

async def take_seat(payload: SFitnessSeat):
  result = False
  config = await get_config_by_integration_code(payload.integration_code)
  API_URL = config.api_url
  API_KEY = config.api_key
  USER = config.username
  PASSWORD = config.password

  url = f"{API_URL}client_to_class"
  data = json.dumps({
    'appointment_id': payload.appointment_id
  })
  credentials = f'{USER}:{PASSWORD}'.encode('utf-8')
  auth_token = base64.b64encode(credentials).decode('utf-8')
  headers = {
    'apikey': API_KEY,
    'Authorization': f"Basic {auth_token}",
    'usertoken': payload.user_token
  }

  response = requests.request("POST", url, headers=headers, data=data)
  ResponseLogger.log_response('client_to_class', json.loads(data), response)
  response_json = response.json();

  try:
    response_data = response_json['data']
    status = response_data['status']

    if status == 'reserved_and_payed':
      result = True
  except:
    pass

  # print('!!!!!!!!!!!response', payload.user_token, data, response.json())


  # row = SFitnessBusyFictitiousUser(user_token=payload.user_token, widget_id=config.id, appointment_id=payload.appointment_id )
  # await add_row(row)

  return result

async def get_free_token(appointment_id):
  busy_rows = await FitnessBusyFictitiousUsersDAO.find_all(appointment_id=appointment_id)
  busy_user_tokens = [row.user_token for row in busy_rows]

  rows = await FitnessFictitiousUsersDAO.find_all()
  user_tokens = [row.user_token for row in rows]
  free_user_tokens = []
  for user_token in user_tokens:
    if not user_token in busy_user_tokens:
      free_user_tokens.append(user_token)

  random.shuffle(free_user_tokens)
  return free_user_tokens[0]

# payload = SFitnessBusyFictitiousUser(
#   user_token='42E1C68DCE07FCCB997638EAB35887D1',
#   widget_id=2,
#   recording=datetime.fromisoformat('2024-08-19T20:00')
# )

# async def tasks():
#   # free_user_tokens = await get_free_tokens('2024-08-19T20:00', 2)
#   # for user_token in free_user_tokens:
#   #   payload = SFitnessBusyFictitiousUser(
#   #     user_token=user_token,
#   #     widget_id=2,
#   #     recording=datetime.fromisoformat('2024-08-19T20:00')
#   #   )
#   #   await FitnessBusyFictitiousUsersDAO.add(payload.model_dump(exclude_none=True))
#   # print('free_user_tokens', free_user_tokens)
#   payload = SSeat(
#     integration_code='cbe6b79a-7c0e-40b1-8a86-1be288729759',
#     appointment_id='3ecb8c33-ee24-4c5b-aa53-0012ec8174e1',
#     user_token='42E1C68DCE07FCCB997638EAB35887D1'
#   )
#   result = await take_seat(payload)
#   print(result)


# asyncio.get_event_loop().run_until_complete(tasks())