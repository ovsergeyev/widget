from dao.BaseDAO import BaseDAO
from models.UserModel import UserModel
from database import async_session_maker
from models.UserModel import UserModel
from sqlalchemy import select

class UsersDAO(BaseDAO):
  model = UserModel

  @classmethod
  async def find_user_by_id(cls, id):
    async with async_session_maker() as session:
      columns = cls.model.__table__.columns
      query = select(*[c for c in columns if c.name != 'hashed_password']).filter_by(id=id)
      result = await session.execute(query)
      return result.mappings().one_or_none()

  @classmethod
  async def find_all(cls, **filter_by):
    async with async_session_maker() as session:
      columns = cls.model.__table__.columns
      query = select(*[c for c in columns if c.name != 'hashed_password']).filter_by(**filter_by)
      result = await session.execute(query)
      return result.mappings().all()