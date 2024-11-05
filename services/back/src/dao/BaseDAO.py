from sqlalchemy import select, insert, delete, text, update
from database import async_session_maker
from datetime import datetime

class BaseDAO:
  model = None

  @classmethod
  async def find_one_or_none(cls, **filter_by):
    async with async_session_maker() as session:
      query = select(cls.model.__table__.columns).filter_by(**filter_by)
      result = await session.execute(query)
      return result.mappings().one_or_none()

  @classmethod
  async def find_all(cls, **filter_by):
    async with async_session_maker() as session:
      query = select(cls.model.__table__.columns).filter_by(**filter_by)
      result = await session.execute(query)
      return result.mappings().all()

  @classmethod
  async def add(cls, **data):
    async with async_session_maker() as session:
      print('data===========', data)
      data['created_at'] = datetime.utcnow()
      query = insert(cls.model).values(**data).returning(cls.model.id)
      await session.execute(query)
      await session.commit()

  @classmethod
  async def update_by_id(cls, id, data):
    data['updated_at'] = datetime.utcnow()
    async with async_session_maker() as session:
      try:
        query = update(cls.model).where(cls.model.id==id).values(**data)
        await session.execute(query)
        await session.commit()
        return True
      except:
        return False

  @classmethod
  async def delete_by_id(cls, id):
    async with async_session_maker() as session:
      try:
        query = delete(cls.model).where(cls.model.id==id)
        await session.execute(query)
        await session.commit()
        return True
      except:
        return False