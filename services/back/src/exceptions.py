from fastapi import HTTPException, status

class BaseException(HTTPException):
  status_code=500
  detail=""

  def __init__(self):
    super().__init__(status_code=self.status_code, detail=self.detail)

class UserAlreadyExistsException(BaseException):
  status_code=status.HTTP_409_CONFLICT
  detail="Пользователь уже существует"

class NoContentException(BaseException):
  status_code=status.HTTP_204_NO_CONTENT

class IncorrectEmailOrPasswordException(BaseException):
  status_code=status.HTTP_401_UNAUTHORIZED
  detail="Неверная почта или пароль"

class IncorrectUsernameOrPasswordException(BaseException):
  status_code=status.HTTP_401_UNAUTHORIZED
  detail="Неверный логин или пароль"

class TokenExpiredException(BaseException):
  status_code=status.HTTP_401_UNAUTHORIZED
  detail="Токен истек"

class TokenAbsentException(BaseException):
  status_code=status.HTTP_401_UNAUTHORIZED
  detail="Токен отсутствует"

class IncorrectTokenFormatException(BaseException):
  status_code=status.HTTP_401_UNAUTHORIZED
  detail="Неверный формат токена"

class UserIsNotPresent(BaseException):
  status_code=status.HTTP_401_UNAUTHORIZED