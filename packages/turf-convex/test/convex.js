var convex = require('../'),
  test = require('tape'),
  glob = require('glob'),
  fs = require('fs');

test('convex hull', function(t){
  glob.sync(__dirname + '/fixtures/in/*.geojson').forEach(function(input) {
      var fcs = JSON.parse(fs.readFileSync(input));
      var output = convex(fcs);
      if (process.env.UPDATE) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
      t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
  });
  t.end();
});
