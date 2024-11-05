from fastapi import APIRouter, Request
from datetime import datetime
import base64
import requests
import json
import pytz
from urllib.parse import quote
from pydantic import BaseModel
from dao.FitnesDAO import FitnesDAO
from dao.FitnessSeatsDAO import FitnesSeatsDAO
from dao.FitnessUkassaDAO import FitnesUkassaDAO
from dao.FitnessUkassaProcessingDAO import FitnesUkassaProcessingDAO
from schemas.Fitness.SFitnes import SFitnes
from schemas.SUkassaPayment import SUkassaPayment
from schemas.Fitness.SFitnessCart import SFitnessCart, SFitnessCartElement
from schemas.Fitness.SFitnessUkassa import SFitnessUkassa
from schemas.Fitness.SFitnessUkassaProcessing import SFitnessUkassaProcessing
# from services.back.src.schemas.Fitness.SFitnessSeat import SSeat
from schemas.Fitness.SFitnessSeat import SFitnessSeat
from schemas.Fitness.SFitnessPayment import SFitnessPayment
from seats import take_seat, get_free_token
from services.Ukassa import Ukassa
from services.ResponseLogger import ResponseLogger

router = APIRouter(
  prefix="/fitness_api",
  tags=["Fitnes API"]
)

class SDates(BaseModel):
  start_date: datetime
  end_date: datetime

async def get_config_by_integration_code(integration_code):
  config = await FitnesDAO.find_one_or_none(integration_code = integration_code)
  return SFitnes(**config)

async def get_count_seats(appointment_id, start_count):
  count_take_up_seats = 0
  seats = await FitnesSeatsDAO.find_all(appointment_id = appointment_id)
  for seat in seats:
    count_take_up_seats += seat.count
  result = start_count - count_take_up_seats
  if result < 0:
    result = 0
  return result

@router.post("/group_classes")
async def group_classes(integration_code: str, dates: SDates):
  config = await get_config_by_integration_code(integration_code)
  API_URL = config.api_url
  API_KEY = config.api_key
  CLUB_ID = config.club_id
  USER = config.username
  PASSWORD = config.password
  proc_start_date = dates.start_date.isoformat().replace('T', ' ')
  proc_end_date = dates.end_date.isoformat().replace('T', ' ')
  url = f"{API_URL}classes?club_id={CLUB_ID}&start_date={proc_start_date}&end_date={proc_end_date}"
  print('url', url)
  # url = quote(url, safe=':/?=&')
  # print('url', url)
  payload = {}
  credentials = f'{USER}:{PASSWORD}'.encode('utf-8')
  auth_token = base64.b64encode(credentials).decode('utf-8')
  headers = {
    'apikey': API_KEY,
    'Authorization': f"Basic {auth_token}"
  }

  response = requests.request("GET", url, headers=headers, data=payload)
  ResponseLogger.log_response('classes', payload, response)

  response_data = response.json()
  data = response_data['data']

  result = {
    "result": True,
    "data": []
  }

  for el in data:
    el['available_slots'] = await get_count_seats(el['appointment_id'], el['available_slots'])
    result["data"].append(el)

  return result

@router.get("/price_list")
async def price_list(integration_code: str):
  config = await get_config_by_integration_code(integration_code)
  API_URL = config.api_url
  API_KEY = config.api_key
  CLUB_ID = config.club_id
  USER = config.username
  PASSWORD = config.password
  url = f"{API_URL}price_list?club_id={CLUB_ID}"
  payload = {}
  credentials = f'{USER}:{PASSWORD}'.encode('utf-8')
  auth_token = base64.b64encode(credentials).decode('utf-8')
  headers = {
    'apikey': API_KEY,
    'Authorization': f"Basic {auth_token}"
  }

  response = requests.request("GET", url, headers=headers, data=payload)
  ResponseLogger.log_response('price_list', payload, response)

  return response.json()

async def payment_1c(payment: SFitnessPayment):
  config = await get_config_by_integration_code(payment.integration_code)
  API_URL = config.api_url
  API_KEY = config.api_key
  CLUB_ID = config.club_id
  USER = config.username
  PASSWORD = config.password
  url = f"{API_URL}payment"
  payload = payment.model_dump_json()
  credentials = f'{USER}:{PASSWORD}'.encode('utf-8')
  auth_token = base64.b64encode(credentials).decode('utf-8')
  headers = {
    'apikey': API_KEY,
    'Authorization': f"Basic {auth_token}",
    "usertoken": payment.user_token
  }

  response = requests.request("POST", url, headers=headers, data=payload)
  ResponseLogger.log_response('payment', json.loads(payload), response)

  # print('response', response)
  # print('error', response.json())

  return response.json()

@router.post("/payment_ukassa")
async def payment_ukassa(integration_code: str, payload: SUkassaPayment):
  config = await FitnesDAO.find_one_or_none(integration_code = integration_code)
  widget_id = config['id']
  ukassa_config: SFitnessUkassa = await FitnesUkassaDAO.find_one_or_none(widget_id=widget_id)
  ukassa = Ukassa(ukassa_config.account_id, ukassa_config.secret_key)

  payment = ukassa.create_payment(payload, ukassa_config.back_link)
  datetime_format = '%Y-%m-%dT%H:%M:%S.%fZ'
  created_at = datetime.strptime(payment.created_at, datetime_format).replace(tzinfo=None)
  description = payment.description.strip().replace("\n", "")
  description = ' '.join(description.split())

  seats = []

  for seat in payload.seats:
    seat['integration_code'] = integration_code
    seat['user_token'] = payload.user_token
    if seat['count']:
      seats.append(seat)

  processing_payment = SFitnessUkassaProcessing(
    uid=payment.id,
    widget_id=widget_id,
    club_id=config['club_id'],
    amount=payment.amount.value,
    payments1C=payload.payments1C,
    seats=seats,
    description=description,
    status=payment.status,
    integration_code=integration_code,
    user_token=payload.user_token,
    created_at=created_at
  )

  print(processing_payment)

  await FitnesUkassaProcessingDAO.add(processing_payment.model_dump())

  return {
    "uid": payment.id,
    "url": payment.confirmation.confirmation_url
  }

@router.post("/get_payment_info")
async def get_payment_info(uid):
  response = await FitnesUkassaProcessingDAO.find_one_or_none(uid=uid)
  processing_payment = SFitnessUkassaProcessing(**response)
  return processing_payment

@router.post("/payment_callback")
async def payment_callback(request: Request):
  # params = dict(request.query_params)
  try:
    payload = await request.json()

    if payload['object']['status'] == "succeeded":
      response = await FitnesUkassaProcessingDAO.find_one_or_none(uid=payload['object']['id'])
      processing_payment = SFitnessUkassaProcessing(**response)

      payments1C = processing_payment.payments1C

      count_transaction = 0
      appointment_ids = set()
      for payment1C in payments1C:
        count_transaction += 1
        appointment_id = payment1C['appointment_id']
        user_token = payment1C['user_token']
        # if appointment_id in appointment_ids:
        #   user_token = await get_free_token(appointment_id)

        appointment_ids.add(appointment_id)

        cart = {
          "count": payment1C['count'],
          "purchase_id": payment1C['purchase_id']
        }
        payment = SFitnessPayment(
          transaction_id=f"{processing_payment.uid}_{count_transaction}",
          use_bank='ukassa',
          promocode=payment1C['promocode'],
          cart=[cart],
          club_id=processing_payment.club_id,
          integration_code=processing_payment.integration_code,
          user_token=user_token,
          payment_list=[
            {
              "type": "card",
              "amount": payment1C['amount']
              # "amount": float(payload['object']['amount']['value'])
            }
          ]
        )

        print('!!!!!Payment', payment)
        await payment_1c(payment)

        # Занятие места для одного человека
        # seat_payload = SSeat(
        #   integration_code=processing_payment.integration_code,
        #   appointment_id=appointment_id,
        #   user_token=user_token
        # )

        # await take_seat(seat_payload)

      # Занимаем места
      seats = processing_payment.seats
      for el in seats:
        seat = SFitnessSeat(
          appointment_id=el['appointment_id'],
          count=el['count'],
          integration_code=el['integration_code'],
          user_token=el['user_token']
        )
        status_1C_seat = False
        if el['appointment_id'] in appointment_ids:
          status_1C_seat = await take_seat(seat)
        if status_1C_seat:
          seat.count -= 1
        await FitnesSeatsDAO.add(**seat.model_dump())

      processing_payment.status = 'succeeded'
      await FitnesUkassaProcessingDAO.update_by_uid(processing_payment.model_dump(exclude_none=True))

    return {"status": "success"}
  except Exception as e:
    print("Error:", e)
    return {"status": "error", "message": str(e)}

@router.post("/cart_cost")
async def cart_cost(integration_code: str, payload: SFitnessCart):
  # {{url}}/hs/api/v3/cart_cost/?cart={"cart_array":[{"purchase_id": "4170e088-3951-11ef-8d1a-00155d46f942", "count": 2}]}&club_id={{club_id}}
  config = await get_config_by_integration_code(integration_code)
  API_URL = config.api_url
  API_KEY = config.api_key
  CLUB_ID = config.club_id
  USER = config.username
  PASSWORD = config.password

  url = f'{API_URL}cart_cost?cart={payload.model_dump_json()}&club_id={CLUB_ID}'
  if payload.promocode:
    url += f'{url}&promocode={payload.promocode}'

  payload = {}
  credentials = f'{USER}:{PASSWORD}'.encode('utf-8')
  auth_token = base64.b64encode(credentials).decode('utf-8')
  headers = {
    'apikey': API_KEY,
    'Authorization': f"Basic {auth_token}"
  }

  response = requests.request("GET", url, headers=headers, data=payload)
  ResponseLogger.log_response('cart_cost', payload, response)

  return response.json()
