from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.UserRouter import router as user_router
from routers.AuthRouter import router as auth_router
from routers.FitnesConfigRouter import router as fitness_config_router
from routers.FitnesRouter import router as fitness_router
from routers.FitnessAuthRouter import router as fitness_auth_router
from routers.FitnessPromocodeRouter import router as fitness_promocode_router
# from routers.group_classes import router as router_group_classes
# from routers.booking import router as router_booking
# from routers.catalog import router as router_catalog

app = FastAPI(
  title='Фитнес API'
)

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*", "greenflowlakhtapark.ru", "http://localhost:5174"],
    allow_origins=[
      "https://greenflowlakhtapark.ru",
      "https://admin.by-link.ru",
      "https://fit.by-link.ru",
      "https://fit-v1.by-link.ru",
      "https://stage.admin.by-link.ru",
      "https://stage.fit.by-link.ru",
      "https://stage.fit-v1.by-link.ru",
      "https://test.admin.by-link.ru",
      "https://test.fit.by-link.ru",
      "https://test.fit-v1.by-link.ru",
      "https://demo.admin.by-link.ru",
      "https://demo.fit.by-link.ru",
      "https://demo.fit-v1.by-link.ru",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:8080",
      "185.71.76.0/27",
      "185.71.77.0/27",
      "77.75.153.0/25",
      "77.75.156.11",
      "77.75.156.35",
      "77.75.154.128/25",
      "2a02:5180::/32",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "Authorization"],
)


app.include_router(user_router)
app.include_router(auth_router)
app.include_router(fitness_config_router)
app.include_router(fitness_router)
app.include_router(fitness_auth_router)
app.include_router(fitness_promocode_router)
# app.include_router(router_group_classes)
# app.include_router(router_booking)
# app.include_router(router_catalog)
