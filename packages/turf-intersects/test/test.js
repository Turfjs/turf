var intersects = require('../'),
  test = require('tape'),
  glob = require('glob'),
  fs = require('fs');

test('intersects -- features', function(t){
  glob.sync(__dirname + '/fixtures/in/*.json').forEach(function(input) {
      var features = JSON.parse(fs.readFileSync(input));
      var output = intersects(features[0], features[1]);
      t.equal(output, true);
  });
  t.end();
});

test('intersects -- geometries', function(t){
  glob.sync(__dirname + '/fixtures/in/*.json').forEach(function(input) {
      var features = JSON.parse(fs.readFileSync(input));
      var output = intersects(features[0].geometry, features[1].geometry);
      t.equal(output, true);
  });
  t.end();
});

test('intersects -- no overlap', function(t){
  var noOverlap = JSON.parse(fs.readFileSync(__dirname+'/fixtures/no-overlap.geojson'));
  var output = intersects(noOverlap[0].geometry, noOverlap[1].geometry);
  t.equal(output, false);
  t.end();
});