var simplify = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var line = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/linestring.geojson'));
var multiline = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/multilinestring.geojson'));
var poly = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/polygon.geojson'));
var multipoly = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/multipolygon.geojson'));
var simple = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/simple.geojson'));
var featurecollection = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/featurecollection.geojson'));
var geometrycollection = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/geometrycollection.geojson'));
var argentina = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/argentina.geojson'));
var suite = new Benchmark.Suite('turf-simplify');
suite
  .add('turf-simplify#LineString',function () {
    simplify(line, 0.1, 0);
  })
  .add('turf-simplify#MultiLineString',function () {
    simplify(multiline, 0.01, 0);
  })
  .add('turf-simplify#Polygon',function () {
    simplify(poly, 0.01, 0);
  })
  .add('turf-simplify#MultiPolygon',function () {
    simplify(multipoly, 0.01, 0);
  })
  .add('turf-simplify#SimplePolygon',function () {
    simplify(simple, 0.01, 0);
  })
  .add('turf-simplify#FeatureCollection',function () {
    simplify(featurecollection, 0.01, 0);
  })
  .add('turf-simplify#GeometryCollection',function () {
    simplify(geometrycollection, 0.01, 0);
  })
  .add('turf-simplify#Argentina',function () {
    simplify(argentina, 0.05, 0);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {

  })
  .run();
