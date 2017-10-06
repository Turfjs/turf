import fs from 'fs';
import Benchmark from 'benchmark';
import nearest from './';

var pt = JSON.parse(fs.readFileSync(__dirname+'/test/pt.geojson'));
var pts = JSON.parse(fs.readFileSync(__dirname+'/test/pts.geojson'));

var suite = new Benchmark.Suite('turf-nearest');
suite
  .add('turf-nearest',function () {
    nearest(pt, pts);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {

  })
  .run();
