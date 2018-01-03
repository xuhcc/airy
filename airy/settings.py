from distutils.util import strtobool
import os

SECRET_KEY = os.environ.get('SECRET_KEY', '')
DEBUG = strtobool(os.environ.get('DEBUG', 'False'))

HTTP_HOST = os.environ.get('HTTP_HOST', 'localhost')
HTTP_PORT = int(os.environ.get('HTTP_PORT', 8085))

DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_PORT = int(os.environ.get('DB_PORT', 5432))
DB_NAME = os.environ.get('DB_NAME', 'airy')
DB_USERNAME = os.environ.get('DB_USERNAME', 'airy')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'airy')

TIMEZONE = os.environ.get('TIMEZONE', 'Europe/Moscow')

SMTP_SERVER = os.environ.get('SMTP_SERVER', 'localhost')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 25))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
SMTP_SENDER = os.environ.get('SMTP_SENDER', 'no-reply@localhost')

USER_NAME = os.environ.get('USER_NAME', 'username')
USER_PASSWORD = os.environ.get('USER_PASSWORD', 'password')
USER_EMAIL = os.environ.get('USER_EMAIL')
