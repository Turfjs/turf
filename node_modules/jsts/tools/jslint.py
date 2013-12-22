#!/usr/bin/env python
import os
import sys
from subprocess import call

rootdir = sys.argv[1]

jslintrun = open('jslintrun.js', 'r').read()

for dirpath, dirnames, filenames in os.walk(rootdir):
    for filename in filenames:
        path = os.path.join(dirpath, filename);
        js = open(path, 'r').read()
        js = 'var path = "' + path + '";' + jslintrun
        js = open('/tmp/workfile', 'w').write(js)
        call(['./shell','/tmp/workfile'])
