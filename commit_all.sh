#!/bin/sh

for d in turf_modules/*; do
    (cd $d; git add .)
    (cd $d; git commit -m "$1")
    (cd $d; git push origin master)
done
