from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  SECRET_KEY: str
  ALGORITHM: str
  ACCESS_TOKEN_EXPIRE_MINUTES: int

  MODE: str
  DB_HOST: str
  DB_PORT: int
  DB_USER: str
  DB_PASS: str
  DB_NAME: str

  LOCAL_DB_HOST: str
  LOCAL_DB_PORT: int
  LOCAL_DB_USER: str
  LOCAL_DB_PASS: str
  LOCAL_DB_NAME: str

  LOG_URL: str

  @property
  def DATABASE_URL(self):
    print("MODE in config.py", self.MODE)
    if self.MODE == "PROD":
      print(f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}")
      return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    if self.MODE == "STAGE":
      print(f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}")
      return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    if self.MODE == "TEST":
      print(f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}")
      return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    if self.MODE == "LOCAL":
      print(f"postgresql+asyncpg://{self.LOCAL_DB_USER}:{self.LOCAL_DB_PASS}@{self.LOCAL_DB_HOST}:{self.LOCAL_DB_PORT}/{self.LOCAL_DB_NAME}")
      return f"postgresql+asyncpg://{self.LOCAL_DB_USER}:{self.LOCAL_DB_PASS}@{self.LOCAL_DB_HOST}:{self.LOCAL_DB_PORT}/{self.LOCAL_DB_NAME}"
    else:
      # print(f"postgresql+asyncpg://{self.TEST_DB_USER}:{self.TEST_DB_PASS}@{self.TEST_DB_HOST}:{self.TEST_DB_PORT}/{self.TEST_DB_NAME}")
      return f"postgresql+asyncpg://{self.TEST_DB_USER}:{self.TEST_DB_PASS}@{self.TEST_DB_HOST}:{self.TEST_DB_PORT}/{self.TEST_DB_NAME}"


  model_config = SettingsConfigDict(env_file=".env")

settings = Settings()