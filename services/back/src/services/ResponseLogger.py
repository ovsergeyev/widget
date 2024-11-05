import logging
import json

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | %(message)s', filename="../../appLogs/back_rest_api_1c.txt", filemode='a', encoding='utf-8')

class ResponseLogger:
  @staticmethod
  def log_response(method_name, request, response):
    try:
      response_json = response.json()  # Попытка преобразовать ответ в JSON
      logging.info("%s | %s | %s | %s", method_name, json.dumps(request, ensure_ascii=False), response.status_code, json.dumps(response_json, ensure_ascii=False))  # JSON в одной строке
    except ValueError:
      logging.error("%s | %s | %s | %s", method_name, json.dumps(request, ensure_ascii=False), response.status_code, response.text)