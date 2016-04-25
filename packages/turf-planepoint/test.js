// http://math.stackexchange.com/questions/28043/finding-the-z-value-on-a-plane-with-x-y-values
// http://stackoverflow.com/a/13916669/461015
var test = require('tape');
var fs = require('fs');
var planepoint = require('./');

test('planepoint', function(t){
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

  var z = planepoint(point, triangle);

  t.ok(z, 'should return the z value of a point on a plane');

  t.end();
});

