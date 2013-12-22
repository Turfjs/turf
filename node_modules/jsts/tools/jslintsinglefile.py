#!/usr/bin/env python
import os
import sys
from subprocess import call

file = sys.argv[1]

jslintrun = open('jslintrun.js', 'r').read()

js = open(file, 'r').read()
js = 'var path = "' + file + '";' + jslintrun
js = open('/tmp/workfile', 'w').write(js)
call(['./shell','/tmp/workfile'])

