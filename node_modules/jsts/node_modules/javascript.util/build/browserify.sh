#!/bin/sh

cd ../src
browserify javascript.util.js -o ../lib/javascript.util-uncompressed.js
cd ..
uglifyjs -mt -nc -o lib/javascript.util-compressed.js lib/javascript.util-uncompressed.js

cat license-notice.txt lib/javascript.util-compressed.js > lib/javascript.util.js
