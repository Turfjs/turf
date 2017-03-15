var grid = require('./');
var Benchmark = require('benchmark');

var bbox = [-95, 30, -85, 40];

var highres = grid(bbox, 100, 'miles').features.length;
var midres = grid(bbox, 10, 'miles').features.length;
var lowres = grid(bbox, 1, 'miles').features.length;
var suite = new Benchmark.Suite('turf-square-grid');
suite
  .add('highres -- ' + highres + ' cells', () => grid(bbox, 100, 'miles'))
  .add('midres  -- ' + midres + ' cells', () => grid(bbox, 10, 'miles'))
  .add('lowres  -- ' + lowres + ' cells', () => grid(bbox, 1, 'miles'))
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
