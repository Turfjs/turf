#!/bin/sh
jsbuild full.cfg -v -o ../lib -j jsts.js
tar -cvf jsts-0.13.2.tar ../src ../doc ../lib ../examples ../src ../license.txt ../authors.txt ../ChangeLog ../README.md
rm jsts-0.13.2.tar.gz
gzip -9 jsts-0.13.2.tar
mkdir tmp
cd tmp
tar xvfz ../jsts-0.13.2.tar.gz
rm ../jsts-0.13.2.zip
zip -r -9 ../jsts-0.13.2.zip *
cd ..
rm tmp -rf
