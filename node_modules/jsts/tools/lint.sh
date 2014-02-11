#/bin/sh
echo "Running gjslint on source tree"
gjslint --jsdoc=false -r ../src
#echo "Running jslint on source tree"
./jslint.py ../src
