import os
import json
from collections import defaultdict

from airy import settings
from airy.core import project_dir

if settings.debug:
    static_folder = os.path.join(project_dir, 'airy', 'assets')
else:
    static_folder = os.path.join(project_dir, 'airy', 'static')


def get_assets():
    assets = defaultdict(list)
    if settings.debug:
        # Bower components
        with open(os.path.join(static_folder, 'libs.json')) as lib_index:
            content = json.load(lib_index)
            for path in content['js']:
                path = os.path.join('lib', 'js', os.path.basename(path))
                assets['js'].append(path)
            for path in content['css']:
                path = os.path.join('lib', 'css', os.path.basename(path))
                assets['css'].append(path)
        # Application files
        for filename in os.listdir(os.path.join(static_folder, 'js')):
            assets['js'].append(os.path.join('js', filename))
        for filename in os.listdir(os.path.join(static_folder, 'css')):
            assets['css'].append(os.path.join('css', filename))
    else:
        assets['js'].append(os.path.join('js', 'scripts.min.js'))
        assets['css'].append(os.path.join('css', 'styles.min.css'))
    return assets
