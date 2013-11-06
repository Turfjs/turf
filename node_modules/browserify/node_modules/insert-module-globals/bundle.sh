#!/bin/bash

browserify --no-detect-globals -r buffer-browserify > buffer.js
echo ';module.exports=require("buffer-browserify")' >> buffer.js
