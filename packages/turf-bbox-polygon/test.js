var test = require('tape')
var bboxPolygon = require('./')

test('bboxPolygon', function(t){
  t.plan(2);

  var poly = bboxPolygon([0,0,10,10]);

  t.ok(poly.geometry.coordinates, 'should take a bbox and return the equivalent polygon feature');
  t.equal(poly.geometry.type, 'Polygon', 'should be a Polygon geometry type');
});

test('bboxPolygon valid geojson', function (t) {
  var poly = bboxPolygon([0,0,10,10]),
    coordinates = poly.geometry.coordinates;
  t.ok(poly, 'should be valid geojson.');
  t.equal(coordinates[0].length, 5);
  t.equal(coordinates[0][0][0], coordinates[0][coordinates.length - 1][0]);
  t.equal(coordinates[0][0][1], coordinates[0][coordinates.length - 1][1]);
  t.end();
});
