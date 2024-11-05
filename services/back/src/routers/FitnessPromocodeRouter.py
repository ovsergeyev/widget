from fastapi import APIRouter, Depends
from schemas.Fitness.SFitnessPromocode import SFitnessPromocode
from dao.FitnessPromocodeDAO import FitnesPromocodeDAO
from dao.FitnesDAO import FitnesDAO
from models.UserModel import UserModel
from auth import get_current_user as depends_get_currents_user

router = APIRouter(
  prefix="/fitness_promocode",
  tags=["Fitnes Promocode"]
)

@router.post('/create_or_update_promocode')
async def create_or_update_promocode(promocode: SFitnessPromocode, current_user: UserModel = Depends(depends_get_currents_user)):
  result = False
  config = await FitnesDAO.find_one_or_none(user_id = current_user.id)
  if promocode.widget_id == config.id or current_user.role == 'admin':
    print('promocode', promocode)
    if promocode.id != None:
      await FitnesPromocodeDAO.update_by_widget_id_and_id(promocode.model_dump())
    else:
      await FitnesPromocodeDAO.add(promocode.model_dump(exclude_none=True))
      result = True

  return result

@router.delete('/delete_promocode')
async def delete_promocode(id: int, current_user: UserModel = Depends(depends_get_currents_user)):
  result = False
  config = await FitnesDAO.find_one_or_none(user_id = current_user.id)
  promocode = await FitnesPromocodeDAO.find_one_or_none(id=id)
  if promocode.widget_id == config.id or current_user.role == 'admin':
    await FitnesPromocodeDAO.delete_by_id(id)
    result = True
  return result