from environs import Env

env = Env()
env.read_env()

SECRET_KEY = env('SECRET_KEY', '')
DEBUG = env.bool('DEBUG', False)

HTTP_HOST = env('HTTP_HOST', 'localhost')
HTTP_PORT = env.int('HTTP_PORT', 8085)

DB_HOST = env('DB_HOST', 'localhost')
DB_PORT = env.int('DB_PORT', 5432)
DB_NAME = env('DB_NAME', 'airy')
DB_USERNAME = env('DB_USERNAME', 'airy')
DB_PASSWORD = env('DB_PASSWORD', 'airy')

TIMEZONE = env('TIMEZONE', 'Europe/Moscow')

SMTP_SERVER = env('SMTP_SERVER', 'localhost')
SMTP_PORT = env.int('SMTP_PORT', 25)
SMTP_USER = env('SMTP_USER', '')
SMTP_PASSWORD = env('SMTP_PASSWORD', '')
SMTP_SENDER = env('SMTP_SENDER', 'no-reply@localhost')

USER_NAME = env('USER_NAME', 'username')
USER_PASSWORD = env('USER_PASSWORD', 'password')
USER_EMAIL = env('USER_EMAIL')
