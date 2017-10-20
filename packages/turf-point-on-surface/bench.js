import fs from 'fs';
import Benchmark from 'benchmark';
import centroid from './';

var fc = JSON.parse(fs.readFileSync(__dirname + '/test/polygons.geojson'));

var suite = new Benchmark.Suite('turf-point-on-surface');
suite
  .add('turf-point-on-surface',function () {
    centroid(fc);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {

  })
  .run();
