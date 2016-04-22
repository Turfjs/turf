var test = require('tap').test;
var bearing = require('./');

test('bearing', function(t){
  var pt1 = {
    type: "Feature",
    geometry: {type: "Point", coordinates: [-75.4, 39.4]}
  };
  var pt2 = {
    type: "Feature",
    geometry: {type: "Point", coordinates: [-75.534, 39.123]}
  };

  var bear = bearing(pt1, pt2);
  t.ok(bear, 'should return a bearing');
  t.end();
});
