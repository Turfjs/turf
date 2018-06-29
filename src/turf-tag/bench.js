import fs from 'fs';
import Benchmark from 'benchmark';
import tag from './';

var points = JSON.parse(fs.readFileSync('./test/tagPoints.geojson'));
var polygons = JSON.parse(fs.readFileSync('./test/tagPolygons.geojson'));

var suite = new Benchmark.Suite('turf-tag');
suite
  .add('turf-tag',function () {
    tag(points, polygons, 'polyID', 'containingPolyID');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {

  })
  .run();
