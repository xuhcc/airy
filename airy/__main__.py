import sys
import os.path

sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))

from airy import runserver

runserver()
