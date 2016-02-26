var along = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var line = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [
        -77.0316696166992,
        38.878605901789236
      ],
      [
        -77.02960968017578,
        38.88194668656296
      ],
      [
        -77.02033996582031,
        38.88408470638821
      ],
      [
        -77.02566146850586,
        38.885821800123196
      ],
      [
        -77.02188491821289,
        38.88956308852534
      ],
      [
        -77.01982498168944,
        38.89236892551996
      ]
    ]
  }
};

var route = JSON.parse(fs.readFileSync(__dirname + '/fixtures/route.geojson'));

var suite = new Benchmark.Suite('turf-along');
suite
  .add('turf-along',function () {
    along(line, 1, 'miles');
  })
  .add('turf-along#route 1 mile',function () {
    along(route, 1, 'miles');
  })
  .add('turf-along#route 10 miles',function () {
    along(route, 10, 'miles');
  })
  .add('turf-along#route 50 miles',function () {
    along(route, 50, 'miles');
  })
  .add('turf-along#route 100 miles',function () {
    along(route, 100, 'miles');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();