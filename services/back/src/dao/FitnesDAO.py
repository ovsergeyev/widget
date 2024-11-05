from dao.BaseDAO import BaseDAO
from models.Fitness.FitnessModel import FitnessModel
from models.Fitness.FitnessScheduleSegmentsModel import FitnessScheduleSegmentsModel
from database import async_session_maker
from sqlalchemy import select, update, insert, delete
from datetime import datetime
import uuid

class FitnesDAO(BaseDAO):
  model = FitnessModel
  schedule_segments_model = FitnessScheduleSegmentsModel

  @classmethod
  async def add(cls, data):
    async with async_session_maker() as session:
      data['integration_code'] = str(uuid.uuid4())
      data['created_at'] = datetime.utcnow()
      query = insert(cls.model).values(**data).returning(cls.model.id)
      await session.execute(query)
      await session.commit()

  @classmethod
  async def update_by_user_id(cls, data):
    data['updated_at'] = datetime.utcnow()
    print('data', data)
    async with async_session_maker() as session:
      try:
        query = update(cls.model).where(cls.model.user_id==data['user_id']).values(**data)
        await session.execute(query)
        await session.commit()
        return True
      except:
        return False

  @classmethod
  async def add_schedule_segment(cls, data):
    data['created_at'] = datetime.utcnow();
    async with async_session_maker() as session:
      query = insert(cls.schedule_segments_model).values(**data).returning(cls.schedule_segments_model.id)
      await session.execute(query)
      await session.commit()

  @classmethod
  async def get_schedule_segments(cls, widget_id):
    async with async_session_maker() as session:
      query = select(cls.schedule_segments_model).filter_by(widget_id=widget_id)
      result = await session.execute(query)
      return result.scalars().all()

  @classmethod
  async def get_schedule_segment_by_id(cls, id):
    async with async_session_maker() as session:
      query = select(cls.schedule_segments_model).filter_by(id=id)
      result = await session.execute(query)
      return result.scalars().one_or_none()

  @classmethod
  async def delete_schedule_segment(cls, id):
    async with async_session_maker() as session:
      try:
        query = delete(cls.schedule_segments_model).where(cls.schedule_segments_model.id==id)
        await session.execute(query)
        await session.commit()
        return True
      except:
        return False