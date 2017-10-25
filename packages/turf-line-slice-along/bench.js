import fs from 'fs';
import Benchmark from 'benchmark';
import lineSliceAlong from './';

var line1 = JSON.parse(fs.readFileSync(__dirname + '/test/fixtures/line1.geojson'));
var route1 = JSON.parse(fs.readFileSync(__dirname + '/test/fixtures/route1.geojson'));
var route2 = JSON.parse(fs.readFileSync(__dirname + '/test/fixtures/route2.geojson'));

var suite = new Benchmark.Suite('turf-line-slice-along');
suite
  .add('turf-line-slice-along#line1 5-15 miles',function () {
    lineSliceAlong(line1, 5, 15, 'miles');
  })
  .add('turf-line-slice-along#line1 50-250 miles',function () {
    lineSliceAlong(line1, 50, 250, 'miles');
  })
  .add('turf-line-slice-along#line1 250-500 miles',function () {
    lineSliceAlong(line1, 250, 500,  'miles');
  })
  .add('turf-line-slice-along#route1 5-15 miles',function () {
    lineSliceAlong(route1, 5, 15, 'miles');
  })
  .add('turf-line-slice-along#route1 50-250 miles',function () {
    lineSliceAlong(route1, 50, 250, 'miles');
  })
  .add('turf-line-slice-along#route1 250-500 miles',function () {
    lineSliceAlong(route1, 250, 500,  'miles');
  })
  .add('turf-line-slice-along#route2 5-15 miles',function () {
    lineSliceAlong(route2, 5, 15, 'miles');
  })
  .add('turf-line-slice-along#route2 15-25 miles',function () {
    lineSliceAlong(route2, 15, 25,  'miles');
  })
  .add('turf-line-slice-along#route2 25-35 miles',function () {
    lineSliceAlong(route2, 25, 35, 'miles');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {

  })
  .run();
