import logging.config
import os

from airy import settings

project_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))

log_dir = os.path.join(project_dir, 'logs')
app_dir = os.path.join(project_dir, 'airy')
static_dir = os.path.join(app_dir, 'static')

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
    'loggers': {
        '': {
            'handlers': ['file'],
            'level': 'WARNING',
        },
        'sqlalchemy.engine.base.Engine': {
            'propagate': False,
            'handlers': ['console'],
        },
    },
}
if settings.DEBUG:
    log_config['loggers']['']['level'] = 'DEBUG'  # type: ignore
    log_config['loggers']['']['handlers'].append('console')  # type: ignore

logging.config.dictConfig(log_config)
