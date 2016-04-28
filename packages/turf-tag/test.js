var test = require('tape');
var fs = require('fs');
var tag = require('./');

test('tag', function(t){
  var points = JSON.parse(fs.readFileSync(__dirname + '/test/tagPoints.geojson'));
  var polygons = JSON.parse(fs.readFileSync(__dirname + '/test/tagPolygons.geojson'));

  var taggedPoints = tag(points, polygons, 'polyID', 'containingPolyID');

  t.ok(taggedPoints.features, 'features should be ok');
  t.equal(taggedPoints.features.length, points.features.length,
    'tagged points should have the same length as the input points');

  var count = taggedPoints.features.filter(function(pt){
    return (pt.properties.containingPolyID === 4);
  }).length;
  t.equal(count, 6, 'polygon 4 should have tagged 6 points');
  t.end();
});
