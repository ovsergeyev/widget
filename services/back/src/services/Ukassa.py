import uuid
from yookassa import Configuration, Payment
from schemas.SUkassaPayment import SUkassaPayment

class Ukassa:
  def __init__(self, account_id, secret_key):
    Configuration.account_id = account_id
    Configuration.secret_key = secret_key

  def create_payment(self, payload: SUkassaPayment, back_link: str):
    payment = Payment.create({
      "amount": {
        "value": str(payload.amount),
        "currency": "RUB"
      },
      "confirmation": {
        "type": "redirect",
        "return_url": back_link
      },
      "capture": True,
      "description": payload.description
    }, uuid.uuid4())
    print(payment.json())
    return payment