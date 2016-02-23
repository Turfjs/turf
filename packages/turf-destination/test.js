var test = require('tape');
var distance = require('turf-distance');
var destination = require('./');

test('destination', function(t){
  var pt1 = {
    "type": "Feature",
    "geometry": {"type": "Point", "coordinates": [-75.0, 39.0]}
  };
  var dist = 100;
  var bear = 180;

  var pt2 = destination(pt1, dist, bear, 'kilometers');
  t.ok(pt2, 'should return a point');
  t.end();
});
