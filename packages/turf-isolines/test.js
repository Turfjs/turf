var test = require('tape');
var fs = require('fs');
var path = require('path');
var isolines = require('./');

test('isolines', function (t) {
  var points = JSON.parse(fs.readFileSync(path.join(__dirname, 'test/Points.geojson')));

  var isolined = isolines(points, 'elevation', 15, [25, 45, 55, 65, 85,  95, 105, 120, 180]);

  t.ok(isolined.features, 'should take a set of points with z values and output a set of contour lines');
  t.equal(isolined.features[0].geometry.type, 'LineString');

  fs.writeFileSync(path.join(__dirname, 'test/isolines.geojson'), JSON.stringify(isolined));
  t.end();
});
