var grid = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var bbox1 = [
        -96.6357421875,
        31.12819929911196,
        -84.9462890625,
        40.58058466412764
      ];

var highres = grid(bbox1, 100, 'miles').features.length;
var midres = grid(bbox1, 10, 'miles').features.length;
var lowres = grid(bbox1, 1, 'miles').features.length;
var suite = new Benchmark.Suite('turf-square-grid');
suite
  .add('turf-square-grid -- '+highres+' cells',function () {
    grid(bbox1, 100, 'miles');
  })
  .add('turf-square-grid -- '+midres+' cells',function () {
    grid(bbox1, 10, 'miles');
  })
  .add('turf-square-grid -- '+lowres+' cells',function () {
    grid(bbox1, 1, 'miles');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();