var test = require('tape');
var fs = require('fs');
var isobands = require('./');

test('isobands', function(t){
  var points = JSON.parse(fs.readFileSync(__dirname + '/geojson/Points.geojson'));

  var isobanded = isobands(points, 'elevation', [0, 3, 5, 7, 10]);

  t.ok(isobanded.features, 'should take a set of points with z values and output a set of filled contour' +
      ' multipolygons');
  t.equal(isobanded.features[0].geometry.type, 'MultiPolygon');

  fs.writeFileSync(__dirname + '/geojson/isobands.geojson', JSON.stringify(isobanded, null, 2));
  t.end();
});

