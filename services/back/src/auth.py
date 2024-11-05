from passlib.context import CryptContext
from dao.UsersDAO import UsersDAO
from fastapi import Depends, Request
from config import settings
from typing import Union
from schemas.SAccessToken import SAccessToken
from datetime import datetime, timedelta, timezone
from exceptions import IncorrectTokenFormatException, TokenAbsentException, TokenExpiredException, UserIsNotPresent
from models.UserModel import UserModel
import jwt
from jwt.exceptions import InvalidTokenError


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
  return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
  return pwd_context.verify(plain_password, hashed_password)

async def authenticate_user(username: str, password: str):
  user = await UsersDAO.find_one_or_none(username=username)
  if not user or user and not verify_password(password, user.hashed_password):
    return None
  return user

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None) -> SAccessToken:
  to_encode = data.copy()
  if expires_delta:
      expire = datetime.now(timezone.utc) + expires_delta
  else:
      expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  to_encode.update({"exp": expire})
  encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
  return SAccessToken(
    access_token=encoded_jwt,
    expire=expire,
    token_type="jwt"
  )

#dependencies
def get_access_token(request: Request):
  token = request.cookies.get("access_token")
  if not token:
    raise TokenAbsentException
  return token

#dependencies
async def get_current_user(access_token: str = Depends(get_access_token)):
  try:
    payload = jwt.decode(access_token, settings.SECRET_KEY, settings.ALGORITHM)
  except InvalidTokenError:
    raise IncorrectTokenFormatException

  expire: str = payload.get("exp")
  if not expire or (int(expire) < datetime.now(timezone.utc).timestamp()):
    raise TokenExpiredException
  user_id: str = payload.get("sub")
  if not user_id:
    raise UserIsNotPresent

  user = await UsersDAO.find_one_or_none(id=int(user_id))
  if not user:
    raise UserIsNotPresent

  return user

#dependencies
async def get_current_admin_user(current_user: UserModel = Depends(get_current_user)):
  if current_user.role != "admin":
    raise UserIsNotPresent
  return current_user