import logging.config
import os

from airy import settings

project_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))

log_dir = os.path.join(project_dir, 'logs')
app_dir = os.path.join(project_dir, 'airy')

static_dir = os.path.join(app_dir, 'assets' if settings.debug else 'static')

log_config = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'nice': {
            'format': '{asctime} {name} [{levelname}] :: {message}',
            'style': '{'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'formatter': 'nice',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': os.path.join(log_dir, 'airy.log'),
            'level': 'WARNING',
            'formatter': 'nice',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'WARNING',
    },
}
if settings.debug:
    log_config['root']['level'] = 'DEBUG'
    log_config['root']['handlers'].append('console')

logging.config.dictConfig(log_config)
