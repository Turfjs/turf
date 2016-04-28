var test = require('tape');
var inside = require('./');
var point = require('turf-helpers').point;
var polygon = require('turf-helpers').polygon;
var fs = require('fs');

test('bad type', function (t) {
  var poly = polygon([[[0,0], [0,100], [100,100], [100,0], [0,0]]]);

  t.throws(function() {
      inside(poly, poly);
  }, /A coordinate, feature, or point geometry is required/);

  t.end();
});

test('featureCollection', function (t) {
  // test for a simple polygon
  var poly = polygon([[[0,0], [0,100], [100,100], [100,0], [0,0]]]);
  var ptIn = point([50, 50]);
  var ptOut = point([140, 150]);

  t.true(inside(ptIn, poly), 'point inside simple polygon');
  t.false(inside(ptOut, poly), 'point outside simple polygon');

  // test for a concave polygon
  var concavePoly = polygon([[[0,0], [50, 50], [0,100], [100,100], [100,0], [0,0]]]);
  var ptConcaveIn = point([75, 75]);
  var ptConcaveOut = point([25, 50]);

  t.true(inside(ptConcaveIn, concavePoly), 'point inside concave polygon');
  t.false(inside(ptConcaveOut, concavePoly), 'point outside concave polygon');

  t.end();
});

test('poly with hole', function (t) {
  var ptInHole = point([-86.69208526611328, 36.20373274711739]);
  var ptInPoly = point([-86.72229766845702, 36.20258997094334]);
  var ptOutsidePoly = point([-86.75079345703125, 36.18527313913089]);
  var polyHole = JSON.parse(fs.readFileSync(__dirname + '/test/poly-with-hole.geojson'));

  t.false(inside(ptInHole, polyHole));
  t.true(inside(ptInPoly, polyHole));
  t.false(inside(ptOutsidePoly, polyHole));

  t.end();
});

test('multipolygon with hole', function (t) {
  var ptInHole = point([-86.69208526611328, 36.20373274711739]);
  var ptInPoly = point([-86.72229766845702, 36.20258997094334]);
  var ptInPoly2 = point([-86.75079345703125, 36.18527313913089]);
  var ptOutsidePoly = point([-86.75302505493164, 36.23015046460186]);
  var multiPolyHole = JSON.parse(fs.readFileSync(__dirname + '/test/multipoly-with-hole.geojson'));

  t.false(inside(ptInHole, multiPolyHole));
  t.true(inside(ptInPoly, multiPolyHole));
  t.true(inside(ptInPoly2, multiPolyHole));
  t.true(inside(ptInPoly, multiPolyHole));
  t.false(inside(ptOutsidePoly, multiPolyHole));

  t.end();
});
