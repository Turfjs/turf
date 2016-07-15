var centerOfMass = require('../'),
  test = require('tape'),
  glob = require('glob'),
  fs = require('fs');

test('center of mass', function(t){
  glob.sync(__dirname + '/fixtures/in/*.geojson').forEach(function(input) {
      var fcs = JSON.parse(fs.readFileSync(input));
      var output = centerOfMass(fcs.features[0]);
      if (process.env.UPDATE) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
      t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
  });
  t.end();
});
