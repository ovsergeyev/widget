from fastapi import APIRouter, Response, Depends
from schemas.SAccessToken import SAccessToken
from auth import get_password_hash, verify_password, authenticate_user, create_access_token
from exceptions import UserAlreadyExistsException, IncorrectUsernameOrPasswordException
from schemas.SUser import SUserLogin

router = APIRouter(
  prefix="/auth",
  tags=["Auth"]
)

@router.post("/login")
async def login_user(response: Response, user_data: SUserLogin):
  user = await authenticate_user(user_data.username, user_data.password)
  if not user:
    raise IncorrectUsernameOrPasswordException
  token: SAccessToken = create_access_token({"sub": str(user.id)})
  response.set_cookie(
    "access_token",
    token.access_token,
    httponly=True,
    expires=token.expire,
    samesite="None",
    secure=True
  )
  return token

@router.post("/logout")
async def logout_user(response: Response):
  response.delete_cookie(
    "access_token",
    httponly=True,
    samesite="None",
    secure=True
  )