from dao.BaseDAO import BaseDAO
from models.Fitness.FitnessUkassaModel import FitnessUkassa
from database import async_session_maker
from sqlalchemy import select, update, insert, delete
from datetime import datetime

class FitnesUkassaDAO(BaseDAO):
  model = FitnessUkassa

  @classmethod
  async def add(cls, data):
    async with async_session_maker() as session:
      data['created_at'] = datetime.utcnow()
      query = insert(cls.model).values(**data).returning(cls.model.id)
      await session.execute(query)
      await session.commit()

  @classmethod
  async def update_by_widget_id(cls, data):
    data['updated_at'] = datetime.utcnow()

    async with async_session_maker() as session:
      try:
        query = select(cls.model).where(
          cls.model.widget_id == data['widget_id']
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