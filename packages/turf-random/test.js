var test = require('tape');
var random = require('./');

test('random(points)', function(t){
  var points = random('points');
  t.equal(points.type, 'FeatureCollection', 'is a featurecollection');
  t.equal(points.features.length, 1, 'right number of features');
  t.equal(points.features[0].geometry.type, 'Point', 'feature type correct');
  t.end();
});

test('random(polygons)', function(t){
  var points = random('polygons');
  t.equal(points.type, 'FeatureCollection', 'is a featurecollection');
  t.equal(points.features.length, 1, 'right number of features');
  t.equal(points.features[0].geometry.type, 'Polygon', 'feature type correct');
  t.end();
});

test('random(polygons, 10)', function(t){
  var points = random('polygons', 10);
  t.equal(points.type, 'FeatureCollection', 'is a featurecollection');
  t.equal(points.features.length, 10, 'right number of features');
  t.equal(points.features[0].geometry.type, 'Polygon', 'feature type correct');
  t.end();
});

test('random(polygons, 1, {num_vertices})', function(t){
  var points = random('polygons', 10, {num_vertices:23});
  t.equal(points.type, 'FeatureCollection', 'is a featurecollection');
  t.equal(points.features.length, 10, 'right number of features');
  t.equal(points.features[0].geometry.coordinates[0].length, 24, 'num vertices');
  t.end();
});

test('random(points, 10, {bbox})', function(t){
  var points = random('points', 10, { bbox: [0, 0, 0, 0] });
  t.equal(points.type, 'FeatureCollection', 'is a featurecollection');
  t.equal(points.features.length, 10, 'right number of features');
  t.equal(points.features[0].geometry.type, 'Point', 'feature type correct');
  t.deepEqual(points.features[0].geometry.coordinates, [0,0], 'feature type correct');
  t.end();
});
