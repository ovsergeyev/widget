from fastapi import APIRouter, Depends
from schemas.SUser import SUser, SUserUpdate, SUserGet
from models.UserModel import UserModel
from dao.UsersDAO import UsersDAO
from exceptions import UserAlreadyExistsException
from auth import get_password_hash, get_current_admin_user, get_current_user as depends_get_currents_user
from exceptions import NoContentException

router = APIRouter(
  prefix="/users",
  tags=["Пользователи"]
)

@router.post("/create_user")
# async def create_user(user_data: SUser):
async def create_user(user_data: SUser, current_user: UserModel = Depends(get_current_admin_user)):
  existing_user = await UsersDAO.find_one_or_none(username=user_data.username)
  if existing_user:
    raise UserAlreadyExistsException
  hashed_password = get_password_hash(user_data.password)
  await UsersDAO.add(
    username=user_data.username,
    hashed_password=hashed_password,
    role=user_data.role,
    is_active=True,
    is_deleted=False
  )

@router.get("/get_user")
async def get_user(id, current_user: UserModel = Depends(get_current_admin_user)):
  user = await UsersDAO.find_user_by_id(int(id))
  if not user:
    raise NoContentException
  return user

@router.get("/get_users")
async def get_users(current_user: UserModel = Depends(get_current_admin_user)):
  users = await UsersDAO.find_all()
  if not users:
    raise NoContentException
  return users

@router.post("/update_user")
async def update_user(user: SUserUpdate, current_user: UserModel = Depends(get_current_admin_user)):
  id = user.id
  user_dict = user.model_dump(exclude={'id'}, exclude_none=True)

  return await UsersDAO.update_by_id(id, user_dict)

@router.delete("/delete_user")
async def delete_user(id: int, current_user: UserModel = Depends(get_current_admin_user)):
  return await UsersDAO.delete_by_id(id)

@router.get("/get_current_user")
async def get_current_user(current_user: UserModel = Depends(depends_get_currents_user)):
  user = SUserGet(**dict(current_user))
  return user