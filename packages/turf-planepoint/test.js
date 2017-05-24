// http://math.stackexchange.com/questions/28043/finding-the-z-value-on-a-plane-with-x-y-values
// http://stackoverflow.com/a/13916669/461015
const test = require('tape');
const fs = require('fs');
const planepoint = require('./');

const triangle = JSON.parse(fs.readFileSync(__dirname+'/test/Triangle.geojson'));
const point = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [
        1,
        1
    ]
  }
};

test('planepoint', t => {

  const zProperty = planepoint(point, triangle);
  t.equal(zProperty, 1, 'should return the z value of a point on a plane using z properties');

  const triangleCoordinates = JSON.parse(JSON.stringify(triangle));
  triangleCoordinates.properties = {};

  const zCoordinate = planepoint(point, triangleCoordinates);
  t.equal(zCoordinate, 1, 'should return the z value of a point on a plane using z coordinates');

  t.end();
});

