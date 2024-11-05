from fastapi import APIRouter, Depends
from schemas.Fitness.SFitnes import SFitnes, SFitnesGet, SFitnesGetWidget
from schemas.Fitness.SFitnessScheduleSegment import SFitnessScheduleSegment, SFitnessScheduleSegmentGet
from schemas.Fitness.SFitnessTariff import SFitnessTariff
from schemas.Fitness.SFitnessUkassa import SFitnessUkassa, SFitnessUkassaGet
from schemas.Fitness.SFitnessFictitiousUser import SFitnessFictitiousUser
from models.UserModel import UserModel
from auth import get_password_hash, get_current_admin_user, get_current_user as depends_get_currents_user
from dao.FitnesDAO import FitnesDAO
from dao.FitnessFictitiousUsersDAO import FitnessFictitiousUsersDAO
from dao.FitnessTariffsDAO import FitnesTariffsDAO
from dao.FitnessUkassaDAO import FitnesUkassaDAO
from schemas.Fitness.SFitnessPromocode import SFitnessPromocode
from dao.FitnessPromocodeDAO import FitnesPromocodeDAO

router = APIRouter(
  prefix="/fitnes",
  tags=["Конфигурация виджета Fitnes"]
)

@router.get("/get_config_by_user_id")
async def get_config_by_user_id(id, current_user: UserModel = Depends(depends_get_currents_user)):
  if current_user.id == int(id) or current_user.role == 'admin':
    config = await FitnesDAO.find_one_or_none(user_id = int(id))
    widget_id = config['id']
    schedule_segments = await FitnesDAO.get_schedule_segments(widget_id=widget_id)
    segments = [SFitnessScheduleSegmentGet(**segment.__dict__) for segment in schedule_segments]
    tariffs = await FitnesTariffsDAO.find_all(widget_id = int(widget_id))
    promocodes = await FitnesPromocodeDAO.find_all(widget_id = config.id)
    promocodes = [SFitnessPromocode(**promocode) for promocode in promocodes]
    ukassa_gateways = await FitnesUkassaDAO.find_all(widget_id=int(widget_id))
    payment_gateways = [SFitnessUkassaGet(**ukassa) for ukassa in ukassa_gateways]
    # return config
    return SFitnesGet(**config, schedule_segments=segments, tariffs=tariffs, promocodes=promocodes, payment_gateways=payment_gateways)
  else:
    return False

@router.get("/get_config_by_integration_code")
async def get_config_by_integration_code(integration_code):
  config = await FitnesDAO.find_one_or_none(integration_code = integration_code)
  widget_id = config['id']
  schedule_segments = await FitnesDAO.get_schedule_segments(widget_id=widget_id)
  segments = [SFitnessScheduleSegmentGet(**segment.__dict__) for segment in schedule_segments]
  tariffs = await FitnesTariffsDAO.find_all(widget_id = int(widget_id))
  promocodes = await FitnesPromocodeDAO.find_all(widget_id = config.id)
  promocodes = [SFitnessPromocode(**promocode) for promocode in promocodes]
  # return config
  return SFitnesGetWidget(**config, schedule_segments=segments, tariffs=tariffs, promocodes=promocodes)

@router.post("/create_or_update_config")
async def create_or_update_config(payload: SFitnes, current_user: UserModel = Depends(depends_get_currents_user)):
  config = await FitnesDAO.find_one_or_none(user_id = payload.user_id)
  if (config and current_user.id == config.user_id) or current_user.role == 'admin':
    if not config:
      config = await FitnesDAO.add(payload.model_dump())
    else:
      print('config', config)
      config = await FitnesDAO.update_by_user_id(payload.model_dump(exclude={'id'}, exclude_none=True))
    print('payload', payload)
    return payload
  return False

@router.post("/create_schedule_segment")
async def create_schedule_segment(payload: SFitnessScheduleSegment, current_user: UserModel = Depends(depends_get_currents_user)):
  config = await FitnesDAO.find_one_or_none(user_id = current_user.id)
  if config.id == payload.widget_id or current_user.role == 'admin':
    await FitnesDAO.add_schedule_segment(payload.model_dump())

@router.delete('/delete_schedule_segment')
async def delete_schedule_segment(id: int, current_user: UserModel = Depends(depends_get_currents_user)):
  config = await FitnesDAO.find_one_or_none(user_id = current_user.id)
  segment = await FitnesDAO.get_schedule_segment_by_id(id)
  print('!!!!!!!!!segment', segment)
  if config.id == segment.widget_id or current_user.role == 'admin':
    await FitnesDAO.delete_schedule_segment(id)

# @router.get("/get_tariffs_by_widget_id")
# async def get_tariffs_by_widget_id(widget_id, current_user: UserModel = Depends(get_current_admin_user)):
#   tariffs = await FitnesTariffsDAO.find_all(widget_id = int(widget_id))
#   return [SFitnessTariff(**tariff) for tariff in tariffs]

# @router.get("/get_tariffs_by_integration_code")
# async def get_tariffs_by_integration_code(integration_code):
#   config = await FitnesDAO.find_one_or_none(integration_code = integration_code)
#   widget_id = config['id']
#   tariffs = await FitnesTariffsDAO.find_all(widget_id = widget_id)
#   return [SFitnessTariff(**tariff) for tariff in tariffs]

@router.post("/create_or_update_tariff")
async def create_or_update_tariff(payload: SFitnessTariff, current_user: UserModel = Depends(depends_get_currents_user)):
  config = await FitnesDAO.find_one_or_none(user_id = current_user.id)
  if payload.widget_id == config.id or current_user.role == 'admin':
    tariff = await FitnesTariffsDAO.find_one_or_none(uid = payload.uid, widget_id = payload.widget_id)
    if not tariff:
      tariff = await FitnesTariffsDAO.add(payload.model_dump())
    else:
      print('tariff', tariff)
      tariff = await FitnesTariffsDAO.update_by_widget_id_and_uid(payload.model_dump(exclude_none=False))
    print('tariff', tariff)
    return tariff
  return False

@router.get("/get_fictitious_users")
async def get_fictitious_user(widget_id: int, current_user: UserModel = Depends(get_current_admin_user)):
  fictitious_users = await FitnessFictitiousUsersDAO.find_all()
  return [SFitnessFictitiousUser(**fictitious_user) for fictitious_user in fictitious_users]

@router.post("/create_fictitious_user")
async def create_fictitious_user(payload: SFitnessFictitiousUser, current_user: UserModel = Depends(get_current_admin_user)):
  fictitious_user = await FitnessFictitiousUsersDAO.find_one_or_none(user_token = payload.user_token)
  if not fictitious_user:
    fictitious_user = await FitnessFictitiousUsersDAO.add(payload.model_dump(exclude_none=True))

@router.delete('/delete_fictitious_user')
async def delete_fictitious_user(user_token: str, current_user: UserModel = Depends(get_current_admin_user)):
  await FitnessFictitiousUsersDAO.delete_by_user_token(user_token)

@router.delete('/delete_tariff')
async def delete_schedule_tariff(id: int, current_user: UserModel = Depends(get_current_admin_user)):
  await FitnesTariffsDAO.delete_by_id(id = id)

@router.post("/create_or_update_ukassa")
async def create_or_update_ukassa(payload: SFitnessUkassa, current_user: UserModel = Depends(depends_get_currents_user)):
  config = await FitnesDAO.find_one_or_none(user_id = current_user.id)
  if payload.widget_id == config.id or current_user.role == 'admin':
    ukassa = await FitnesUkassaDAO.find_one_or_none(widget_id = payload.widget_id)
    if not ukassa:
      ukassa = await FitnesUkassaDAO.add(payload.model_dump())
    else:
      print('ukassa', ukassa)
      ukassa = await FitnesUkassaDAO.update_by_widget_id(payload.model_dump(exclude_none=True))
    print('ukassa', ukassa)
    return ukassa
  return False

@router.delete('/delete_ukassa')
async def delete_ukassa(id: int, current_user: UserModel = Depends(get_current_admin_user)):
  await FitnesUkassaDAO.delete_by_id(id = id)