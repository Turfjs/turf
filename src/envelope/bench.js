import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import envelope from './';

const fixture = load.sync(path.join(__dirname, 'test', 'in', 'feature-collection.geojson'));

var suite = new Benchmark.Suite('turf-envelope');
suite
  .add('turf-envelope',function () {
    envelope(fixture);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {

  })
  .run();
