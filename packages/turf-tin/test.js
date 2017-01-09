var test = require('tape');
var fs = require('fs');
var path = require('path');
var tin = require('./index.js');

test('tin', function(t){
  var points = require(path.join(__dirname,  'test', 'Points.json'));
  var tinned = tin(points, 'elevation');

  t.equal(tinned.features[0].geometry.type, 'Polygon');
  t.equal(tinned.features.length, 24);

  fs.writeFileSync(path.join(__dirname, 'test', 'Tin.json'), JSON.stringify(tinned));
  t.end();
});
