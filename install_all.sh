#!/bin/sh

for d in turf_modules/*; do
    (cd $d; rm -rf node_modules && npm install)
done
