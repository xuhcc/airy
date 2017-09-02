import os
import json

from airy import settings
from airy.config import app_dir, static_dir


def get_assets():
    assets = {
        'js': [],
        'css': [],
    }
    if settings.DEBUG:
        with open(os.path.join(app_dir, 'frontend',
                               'index.json')) as index_file:
            index = json.load(index_file)
            # Bower components
            for path in index['lib']['js']:
                path = os.path.join('js', 'lib', os.path.basename(path))
                assets['js'].append(path)
            for path in index['lib']['css']:
                path = os.path.join('css', 'lib', os.path.basename(path))
                assets['css'].append(path)
        # Application styles
        for filename in os.listdir(os.path.join(static_dir, 'css')):
            if filename.endswith('.css'):
                assets['css'].append(os.path.join('css', filename))
    else:
        assets['js'].append(os.path.join('js', 'scripts.min.js'))
        assets['css'].append(os.path.join('css', 'styles.min.css'))
    return assets
