var test = require('tape');
var fs = require('fs');
var extent = require('./');

// test data
var fc = require('./geojson/FeatureCollection');
var pt  = require('./geojson/Point');
var line = require('./geojson/LineString');
var poly = require('./geojson/Polygon');
var multiLine = require('./geojson/MultiLineString');
var multiPoly = require('./geojson/MultiPolygon');

test('extent', function(t){
  // FeatureCollection
  var fcExtent = extent(fc);

  t.ok(fcExtent, 'FeatureCollection');
  t.equal(fcExtent[0], 20);
  t.equal(fcExtent[1], -10);
  t.equal(fcExtent[2], 130);
  t.equal(fcExtent[3], 4);

  // Point
  var ptExtent = extent(pt);
  t.ok(ptExtent, 'Point');
  t.equal(ptExtent[0], 102);
  t.equal(ptExtent[1], 0.5);
  t.equal(ptExtent[2], 102);
  t.equal(ptExtent[3], 0.5);

  // Line
  var lineExtent = extent(line);

  t.ok(lineExtent, 'Line');
  t.equal(lineExtent[0], 102);
  t.equal(lineExtent[1], -10);
  t.equal(lineExtent[2], 130);
  t.equal(lineExtent[3], 4);

  // Polygon
  var polyExtent = extent(poly);

  t.ok(polyExtent, 'Polygon');
  t.equal(polyExtent[0], 100);
  t.equal(polyExtent[1], 0);
  t.equal(polyExtent[2], 101);
  t.equal(polyExtent[3], 1);

  // MultiLineString
  var multiLineExtent = extent(multiLine);

  t.ok(multiLineExtent, 'MultiLineString');
  t.equal(multiLineExtent[0], 100);
  t.equal(multiLineExtent[1], 0);
  t.equal(multiLineExtent[2], 103);
  t.equal(multiLineExtent[3], 3);

  // MultiPolygon
  var multiPolyExtent = extent(multiPoly);

  t.ok(multiPolyExtent, 'MultiPolygon');
  t.equal(multiPolyExtent[0], 100);
  t.equal(multiPolyExtent[1], 0);
  t.equal(multiPolyExtent[2], 103);
  t.equal(multiPolyExtent[3], 3);

  t.throws(function() {
      var multiPolyExtent = extent({});
  }, /Unknown Geometry Type/, 'unknown geometry type error');

  t.end();
});
