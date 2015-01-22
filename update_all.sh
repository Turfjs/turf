#!/bin/sh

for d in turf_modules/*; do
    (cd $d; npm install)
done
