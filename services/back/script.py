import asyncio
from src.services.Ukassa import Ukassa, SUkassaPayment


async def tasks():
  payment_payload = SUkassaPayment(
    amount=1121,
    return_url="https://mail.com",
    description="Заказ номер X"
  )
  ukassa = Ukassa(412379, "test_TTItRfqEf0VXzWSJ5KLWSL113zECaYAo_69z-QbN7Xk")
  payment = ukassa.create_payment(payment_payload)
  print('url', payment.confirmation.confirmation_url)
  return payment.confirmation.confirmation_url





asyncio.get_event_loop().run_until_complete(tasks())
