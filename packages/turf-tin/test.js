var test = require('tape');
var fs = require('fs');
var tin = require('./index.js');

test('tin', function(t){
  var points = JSON.parse(fs.readFileSync(__dirname+'/geojson/Points.geojson'));
  var tinned = tin(points, 'elevation');

  t.equal(tinned.features[0].geometry.type, 'Polygon');
  t.equal(tinned.features.length, 24);

  fs.writeFileSync(__dirname+'/geojson/Tin.geojson', JSON.stringify(tinned));
  t.end();
});
