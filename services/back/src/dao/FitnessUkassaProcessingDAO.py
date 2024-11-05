from dao.BaseDAO import BaseDAO
from models.Fitness.FitnessUkassaProcessingModel import FitnessUkassaProcessing
from database import async_session_maker
from sqlalchemy import select, update, insert, delete
from datetime import datetime
import json

class FitnesUkassaProcessingDAO(BaseDAO):
  model = FitnessUkassaProcessing

  @classmethod
  async def find_one_or_none(cls, **filter_by):
    async with async_session_maker() as session:
      query = select(cls.model.__table__.columns).filter_by(**filter_by)
      result = await session.execute(query)
      item = result.mappings().one_or_none()
      if item:
        item_dict = dict(item)
        item_dict['payments1C'] = json.loads(item_dict['payments1C'])
        item_dict['seats'] = json.loads(item_dict['seats'])
        return item_dict
      return None

  @classmethod
  async def add(cls, data):
    async with async_session_maker() as session:
      data['payments1C'] = json.dumps(data['payments1C'])
      data['seats'] = json.dumps(data['seats'])
      # data['created_at'] = datetime.utcnow()
      # processing_payment = FitnessUkassaProcessing(**data)
      query = insert(cls.model).values(**data).returning(cls.model.uid)
      await session.execute(query)
      await session.commit()

  @classmethod
  async def update_by_uid(cls, data):
    data['payments1C'] = json.dumps(data['payments1C'])
    data['seats'] = json.dumps(data['seats'])
    data['updated_at'] = datetime.utcnow()
    async with async_session_maker() as session:
      try:
        query = select(cls.model).where(
          cls.model.uid == data['uid']
        )
        result = await session.execute(query)
        instance = result.scalar_one_or_none()

        if instance:
          for key, value in data.items():
            setattr(instance, key, value)
          await session.commit()
          return True
        else:
          return False
      except Exception as e:
        print(f"Ошибка обновления записи: {e}")
        await session.rollback()
        return False

  # @classmethod
  # async def add_schedule_segment(cls, data):
  #   data['created_at'] = datetime.utcnow();
  #   async with async_session_maker() as session:
  #     query = insert(cls.schedule_segments_model).values(**data).returning(cls.schedule_segments_model.id)
  #     await session.execute(query)
  #     await session.commit()

  # @classmethod
  # async def get_schedule_segments(cls, widget_id):
  #   async with async_session_maker() as session:
  #     query = select(cls.schedule_segments_model).filter_by(widget_id=widget_id)
  #     result = await session.execute(query)
  #     return result.scalars().all()

  # @classmethod
  # async def delete_schedule_segment(cls, id):
  #   async with async_session_maker() as session:
  #     try:
  #       query = delete(cls.schedule_segments_model).where(cls.schedule_segments_model.id==id)
  #       await session.execute(query)
  #       await session.commit()
  #       return True
  #     except:
  #       return False