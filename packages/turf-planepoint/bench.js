var planepoint = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var triangle = JSON.parse(fs.readFileSync(__dirname+'/test/Triangle.geojson'));
var point = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [
      -75.3221,
      39.529
    ]
  }
};

var suite = new Benchmark.Suite('turf-planepoint');
suite
  .add('turf-planepoint',function () {
    planepoint(point, triangle);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();
