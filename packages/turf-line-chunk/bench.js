const path = require('path');
const Benchmark = require('benchmark');
const load = require('load-json-file');
const chunk = require('./');

const line = load.sync(path.join(__dirname, 'test', 'in', 'feature.geojson'));

var suite = new Benchmark.Suite('turf-line-chunk');
suite
  .add('turf-line-chunk', function () {
      chunk(line, 15, 'miles');
  })
  .on('cycle', function (event) {
      console.log(String(event.target));
  })
  .on('complete', function () {})
  .run();
