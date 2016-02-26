#!/usr/bin/env node
var point =  require('../');
var argv = require('minimist')(process.argv.slice(2));

var x,y;

if(argv.h || argv.help){
  docs();
}
else {
  if(argv.point && argv.y){
    x = parseFloat(process.argv[process.argv.indexOf('-x') + 1]);
    y = parseFloat(process.argv[process.argv.indexOf('-y') + 1]);
  } 

  console.log(JSON.stringify(point(x, y)));
}

function docs(){
  console.log('turf-inside\n===\n');
  console.log('-h --help: show docs\n');
  console.log('\nusage: \nturf-point [point_file] [polygon_file]\n\n')
}