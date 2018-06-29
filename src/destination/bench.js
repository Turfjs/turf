const fs = require('fs');
const Benchmark = require('benchmark');
const destination = require('./').default

var pt1 = [-75.0, 39.0]
var dist = 100;
var bear = 180;

var suite = new Benchmark.Suite('destination');
suite
  .add('destination',() => destination(pt1, dist, bear))
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();