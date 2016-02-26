var test = require('tape');
var jenks = require('./');
var fs = require('fs');

test('jenks', function(t){
  var points = JSON.parse(fs.readFileSync(__dirname+'/geojson/Points.geojson'));

  var jenked = jenks(points, 'elevation', 5);

  t.ok(jenked, 'should take a set of points and an array of percentiles and return a list of jenks breaks');
  t.equal(jenked.length, 6);

  t.end();
});