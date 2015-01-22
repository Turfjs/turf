#!/bin/sh

for d in turf_modules/*; do
    echo $d
    echo '---------------'
    (cd $d; npm outdated --depth=0  | grep "turf")
    echo ''
done
