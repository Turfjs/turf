const test = require('tape');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const convex = require('.');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

test('convex hull', function(t){
  t.deepEqual(convex({ type: 'FeatureCollection', features: [] }),
    undefined, 'corner case: undefined hull');
  glob.sync(directories.in + '*.geojson').forEach(function(input) {
      var fcs = JSON.parse(fs.readFileSync(input));
      var output = convex(fcs);
      if (process.env.REGEN) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
      t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
  });
  t.end();
});
