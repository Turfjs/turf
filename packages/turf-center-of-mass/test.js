var test = require('tape');
var glob = require('glob');
var fs = require('fs');
var centerOfMass = require('.');

test('center of mass', function(t){
  glob.sync(__dirname + '/test/in/*.geojson').forEach(function(input) {
      var jsonData = JSON.parse(fs.readFileSync(input));
      var output = centerOfMass(jsonData);
      if (process.env.UPDATE) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
      t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
  });
  t.end();
});
