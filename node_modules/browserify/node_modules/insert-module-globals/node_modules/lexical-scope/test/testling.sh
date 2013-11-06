#!/bin/bash
mkdir -p test/temp
echo '<script src="bundle.js"></script>' > test/temp/test.html
browserify -t brfs test/*.js -o test/temp/bundle.js
