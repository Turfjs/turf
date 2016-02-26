var test = require('tape');
var geometries = require('./');

var point = geometries.point;
var polygon = geometries.polygon;
var lineString = geometries.lineString;
var featureCollection = geometries.featureCollection;
var multiLineString = geometries.multiLineString;

test('point', function(t){
  var ptArray = point([5, 10], {name: 'test point'});

  t.ok(ptArray);
  t.equal(ptArray.geometry.coordinates[0], 5);
  t.equal(ptArray.geometry.coordinates[1], 10);
  t.equal(ptArray.properties.name, 'test point');

  t.throws(function() {
      point('hey', 'invalid');
  }, 'numbers required');

  var noProps = point([0, 0]);
  t.deepEqual(noProps.properties, {}, 'no props becomes {}');

  t.end();
});

test('polygon', function(t){
  var poly = polygon([[[5, 10], [20, 40], [40, 0], [5, 10]]] , {name: 'test polygon'});
  t.ok(poly);
  t.equal(poly.geometry.coordinates[0][0][0], 5);
  t.equal(poly.geometry.coordinates[0][1][0], 20);
  t.equal(poly.geometry.coordinates[0][2][0], 40);
  t.equal(poly.properties.name, 'test polygon');
  t.equal(poly.geometry.type, 'Polygon');
  t.throws(function() {
      t.equal(polygon([[[20.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0]]]).message);
  }, /First and last Position are not equivalent/, 'invalid ring - not wrapped');
  t.throws(function() {
      t.equal(polygon([[[20.0,0.0],[101.0,0.0]]]).message);
  }, /Each LinearRing of a Polygon must have 4 or more Positions/, 'invalid ring - too few positions');
  var noProperties = polygon([[[5, 10], [20, 40], [40, 0], [5, 10]]]);
  t.deepEqual(noProperties.properties, {});
  t.end();
});

test('lineString', function(t){
  var line = lineString([[5, 10], [20, 40]], {name: 'test line'});
  t.ok(line, 'creates a linestring');
  t.equal(line.geometry.coordinates[0][0], 5);
  t.equal(line.geometry.coordinates[1][0], 20);
  t.equal(line.properties.name, 'test line');
  t.throws(function() {
      var line = lineString();
  }, /No coordinates passed/, 'error on no coordinates');
  var noProps = lineString([[5, 10], [20, 40]]);
  t.deepEqual(noProps.properties, {}, 'no properties case');
  t.end();
});

test('featureCollection', function(t){
  t.plan(7);
  var p1 = point([0,0], {name: 'first point'}),
        p2 = point([0,10]),
        p3 = point([10,10]),
        p4 = point([10,0]);
  var fc = featureCollection([p1,p2,p3,p4]);
  t.ok(fc);
  t.equal(fc.features.length, 4);
  t.equal(fc.features[0].properties.name, 'first point');
  t.equal(fc.type, 'FeatureCollection');
  t.equal(fc.features[1].geometry.type, 'Point');
  t.equal(fc.features[1].geometry.coordinates[0], 0);
  t.equal(fc.features[1].geometry.coordinates[1], 10);
});

test('multilinestring', function(t){
  t.deepEqual(multiLineString([[[0,0],[10,10]], [[5,0],[15,8]]]), {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "MultiLineString",
      "coordinates": [[[0,0],[10,10]], [[5,0],[15,8]]]
    }
  }, 'takes coordinates');

  t.deepEqual(multiLineString([[[0,0],[10,10]], [[5,0],[15,8]]], {test: 23}), {
    "type": "Feature",
    "properties": {
      test: 23
    },
    "geometry": {
      "type": "MultiLineString",
      "coordinates": [[[0,0],[10,10]], [[5,0],[15,8]]]
    }
  }, 'takes properties');


  t.throws(function(err){
    multiLineString();
  }, 'throws error with no coordinates');

  t.end();
});
