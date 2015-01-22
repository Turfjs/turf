#!/bin/sh

for d in turf_modules/*; do
    (cd $d; git add . && git commit -m "$1" && git push origin master)
done
