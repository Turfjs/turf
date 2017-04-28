var test = require('tape');
var tangent = require('./');
var fs = require('fs');
var helpers = require('@turf/helpers');

test('point-on-surface -- closest vertex on polygons', function(t) {
  // var fc = JSON.parse(fs.readFileSync(__dirname + '/test/polygons.geojson'));
  var poly = helpers.polygon(
[
          [
            [
              19.6875,
              56.36525013685606
            ],
            [
              4.39453125,
              36.73888412439431
            ],
            [
              6.6796875,
              21.616579336740603
            ],
            [
              16.5234375,
              31.203404950917395
            ],
            [
              27.0703125,
              17.476432197195518
            ],
            [
              19.6875,
              56.36525013685606
            ]
          ]
        ]);
  var point = helpers.point([45.3515625, 32.24997445586331]);

  var out = tangent(point, poly);
  console.log(out);


  t.end();
});

