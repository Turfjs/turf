var difference = require('.');
var test = require('tape');
var glob = require('glob');
var fs = require('fs');
var turf = require('@turf/helpers');

// var REGEN = process.env.REGEN;

test('difference', function(t){
  var polygon = turf.polygon([[
    [
    0,
    0
    ],
    [
    0,
    1
    ],
    [
    1,
    1
    ],
    [
    1,
    0
    ],
    [
    0,
    0
    ]
    ]])

    var polygon2 = turf.polygon([[
            [
              -0.2,
              -0.2
            ],
            [
              0.2,
              0.8
            ],
            [
              1.8,
              1.8
            ],
            [
              0.8,
              0.2
            ],
            [
              -0.2,
              -0.2
            ]
    ]])
    var out = difference(polygon, polygon2)
    console.log(JSON.stringify(out))
  t.end();
});

// test('difference', function(t){
//   glob.sync(__dirname + '/test/in/*.geojson').forEach(function(input) {
//       var features = JSON.parse(fs.readFileSync(input));
//       var before = JSON.parse(JSON.stringify(features));
//       var output = difference(features[0], features[1]);
//       if (REGEN) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
//       t.deepEqual(before, features, 'does not mutate data');
//       t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
//   });
//   t.end();
// });

// test('difference -- geometries', function(t){
//   glob.sync(__dirname + '/test/in/*.geojson').forEach(function(input) {
//       var fcs = JSON.parse(fs.readFileSync(input));
//       var before = JSON.parse(JSON.stringify(fcs));
//       var output = difference(fcs[0].geometry, fcs[1].geometry);
//       if (REGEN) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
//       t.deepEqual(before, fcs, 'does not mutate data');
//       t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
//   });
//   t.end();
// });

// test('difference -- geometries', function(t){
//   glob.sync(__dirname + '/test/in/*.geojson').forEach(function(input) {
//       var fcs = JSON.parse(fs.readFileSync(input));
//       var before = JSON.parse(JSON.stringify(fcs));
//       var output = difference(fcs[0].geometry, fcs[1].geometry);
//       if (REGEN) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
//       t.deepEqual(before, fcs, 'does not mutate data');
//       t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
//   });
//   t.end();
// });

// test('difference -- empty set', function(t) {
//   var polys = JSON.parse(fs.readFileSync(__dirname+'/test/full.geojson'));
//   var result = difference(polys[1], polys[0]);
//   t.deepEqual(result, undefined);
//   t.notOk(result);
//   t.end();
// });
