var difference = require('../'),
  test = require('tape'),
  glob = require('glob'),
  fs = require('fs');

var UPDATE = process.env.UPDATE;

test('difference', function(t){
  glob.sync(__dirname + '/fixtures/in/*.geojson').forEach(function(input) {
      var features = JSON.parse(fs.readFileSync(input));
      var before = JSON.parse(JSON.stringify(features));
      var output = difference(features[0], features[1]);
      if (UPDATE) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
      t.deepEqual(before, features, 'does not mutate data');
      t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
  });
  t.end();
});

test('difference -- geometries', function(t){
  glob.sync(__dirname + '/fixtures/in/*.geojson').forEach(function(input) {
      var fcs = JSON.parse(fs.readFileSync(input));
      var before = JSON.parse(JSON.stringify(fcs));
      var output = difference(fcs[0].geometry, fcs[1].geometry);
      if (UPDATE) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
      t.deepEqual(before, fcs, 'does not mutate data');
      t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
  });
  t.end();
});

test('difference -- geometries', function(t){
  glob.sync(__dirname + '/fixtures/in/*.geojson').forEach(function(input) {
      var fcs = JSON.parse(fs.readFileSync(input));
      var before = JSON.parse(JSON.stringify(fcs));
      var output = difference(fcs[0].geometry, fcs[1].geometry);
      if (UPDATE) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
      t.deepEqual(before, fcs, 'does not mutate data');
      t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
  });
  t.end();
});

test('difference -- empty set', function(t) {
  var polys = JSON.parse(fs.readFileSync(__dirname+'/fixtures/full.geojson'));
  var result = difference(polys[1], polys[0]);
  t.deepEqual(result, undefined);
  t.notOk(result);
  t.end();
});
