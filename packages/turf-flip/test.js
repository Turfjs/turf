var test = require('tape');
var flip = require('./');
var point = require('turf-helpers').point;
var linestring = require('turf-helpers').lineString;
var polygon = require('turf-helpers').polygon;
var featurecollection = require('turf-helpers').featureCollection;

test('flip', function (t) {
  // Point Geometry
  var pt = point([1, 0]);
  var flippedPt = flip(pt.geometry);
  t.equal(flippedPt.coordinates[0], 0);
  t.equal(flippedPt.coordinates[1], 1);

  t.equal(pt.geometry.coordinates[0], 1, 'does not mutate original');
  t.equal(pt.geometry.coordinates[1], 0, 'does not mutate original');

  // Point
  var pt2 = point([1, 0]);
  var flippedPt2 = flip(pt2);

  t.ok(flippedPt2, 'should flip a point coordinate');
  t.equal(flippedPt2.geometry.coordinates[0], 0);
  t.equal(flippedPt2.geometry.coordinates[1], 1);

  // Line
  var line = linestring([[1, 0], [1, 0]]);
  var flippedLine = flip(line);

  t.ok(flippedLine, 'should flip the x and ys of a linestring');
  t.equal(flippedLine.geometry.coordinates[0][0], 0);
  t.equal(flippedLine.geometry.coordinates[0][1], 1);
  t.equal(flippedLine.geometry.coordinates[1][0], 0);
  t.equal(flippedLine.geometry.coordinates[1][1], 1);

  // Polygon
  var poly = polygon([[[1, 0], [1, 0], [1, 2], [1, 0]], [[.2, .2], [.3, .3], [.1, .2], [1, 0], [.2, .2]]]);
  var flippedPoly = flip(poly);

  t.ok(flippedPoly, 'should flip the x and ys of a polygon');
  t.equal(flippedPoly.geometry.coordinates[0][0][0], 0);
  t.equal(flippedPoly.geometry.coordinates[0][0][1], 1);
  t.equal(flippedPoly.geometry.coordinates[0][1][0], 0);
  t.equal(flippedPoly.geometry.coordinates[0][1][1], 1);
  t.equal(flippedPoly.geometry.coordinates[0][2][0], 2);
  t.equal(flippedPoly.geometry.coordinates[0][2][1], 1);
  t.equal(flippedPoly.geometry.coordinates[1][2][0], 0.2);
  t.equal(flippedPoly.geometry.coordinates[1][2][1], 0.1);

  // FeatureCollection
  var pt3 = point([1, 0]);
  var pt4 = point([1, 0]);
  var fc = featurecollection([pt3, pt4]);
  var flippedFC = flip(fc);

  t.ok(flippedFC, 'should flip the x and ys of a featurecollection');
  t.equal(flippedFC.features[0].geometry.coordinates[0], 0);
  t.equal(flippedFC.features[0].geometry.coordinates[1], 1);
  t.equal(flippedFC.features[1].geometry.coordinates[0], 0);
  t.equal(flippedFC.features[1].geometry.coordinates[1], 1);

  t.end();
});
