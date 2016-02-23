var test = require('tape');
var quantile = require('./');
var fs = require('fs');

test('quantile', function(t){
  var points = JSON.parse(fs.readFileSync(__dirname+'/geojson/Points.geojson'));

  var quantiled = quantile(points, 'elevation', [10,30,40,60,80,90,99]);

  t.ok(quantiled, 'should take a set of points and an array of percentiles and return a list of quantile breaks');
  t.equal(quantiled.length, 7);

  t.end();
})