#!/usr/bin/env node
var point =  require('../');
var argv = require('minimist')(process.argv.slice(2));

var x,y;

if(argv.h || argv.help){
  docs();
}
else {
  if(argv.x && argv.y){
    x = parseFloat(process.argv[process.argv.indexOf('-x') + 1]);
    y = parseFloat(process.argv[process.argv.indexOf('-y') + 1]);
  } else if(argv.lat && argv.lon){
    x = parseFloat(process.argv[process.argv.indexOf('--lon') + 1]);
    y = parseFloat(process.argv[process.argv.indexOf('--lat') + 1]);
  } else if(argv.latitude && argv.longitude){
    x = parseFloat(process.argv[process.argv.indexOf('--longitude') + 1]);
    y = parseFloat(process.argv[process.argv.indexOf('--latitude') + 1]);
  } else if(process.argv[2] && process.argv[3]) {
    x = parseFloat(process.argv[2]);
    y = parseFloat(process.argv[3]);
  }

  console.log(JSON.stringify(point([x, y])));
}

function docs(){
  console.log('turf-point\n===\n');
  console.log('-h --help: show docs\n');
  console.log('coordinate inputs:\n')
  console.log('--lat --lon');
  console.log('--latitude --longitude');
  console.log('-x -y');
  console.log('\ndefault: \nturf-point [num1] [num2]\n\n')
}
