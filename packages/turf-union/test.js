var union = require('./');
var test = require('tape');
var glob = require('glob');
var fs = require('fs');

var REGEN = false;

test('union', function (t) {
  glob.sync(__dirname + '/test/in/*.geojson').forEach(function (input) {
      var fcs = JSON.parse(fs.readFileSync(input));
      var args = [];
      for (var i = 0; i < fcs.length; i++) {
        args[i] = fcs[i].features[0];
      }
      var output = union.apply(this, args);
      if (REGEN) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
      t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
  });
  t.end();
});
