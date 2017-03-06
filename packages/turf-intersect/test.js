var test = require('tape');
var glob = require('glob');
var fs = require('fs');
var intersect = require('.');

var REGEN = process.env.REGEN;

test('intersect -- features', function(t){
  glob.sync(__dirname + '/test/in/*.json').forEach(function(input) {
      var features = JSON.parse(fs.readFileSync(input));
      var output = intersect(features[0], features[1]);
      if (REGEN) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
      t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
  });
  t.end();
});

test('intersect -- geometries', function(t){
  glob.sync(__dirname + '/test/in/*.json').forEach(function(input) {
      var features = JSON.parse(fs.readFileSync(input));
      var output = intersect(features[0].geometry, features[1].geometry);
      if (REGEN) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
      t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
  });
  t.end();
});

test('intersect -- no overlap', function(t){
  var noOverlap = JSON.parse(fs.readFileSync(__dirname+'/test/no-overlap.geojson'));
  var output = intersect(noOverlap[0].geometry, noOverlap[1].geometry);
  t.deepEqual(output, undefined);
  t.end();
});