from dao.BaseDAO import BaseDAO
from models.Fitness.FitnessPromocodeModel import FitnessPromocodeModel
from database import async_session_maker
from sqlalchemy import select, update, insert, delete
from datetime import datetime

class FitnesPromocodeDAO(BaseDAO):
  model = FitnessPromocodeModel

  @classmethod
  async def add(cls, data):
    async with async_session_maker() as session:
      data['created_at'] = datetime.utcnow()
      query = insert(cls.model).values(**data).returning(cls.model.id)
      await session.execute(query)
      await session.commit()

  @classmethod
  async def update_by_widget_id_and_id(cls, data):
    data['updated_at'] = datetime.utcnow()

    async with async_session_maker() as session:
      try:
        query = select(cls.model).where(
          cls.model.id == data['id'],
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
        # Протоколируйте исключение или обработайте его соответствующим образом
        print(f"Ошибка обновления записи: {e}")
        await session.rollback()
        return False