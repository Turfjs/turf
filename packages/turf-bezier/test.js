var bezier = require('./'),
  test = require('tape'),
  fs = require('fs');

test('bezier', function(t) {
    var lineIn = JSON.parse(fs.readFileSync(__dirname+'/fixture/bezierIn.geojson'));
    var syncLineOut = bezier(lineIn, 5000, .85);
    if (syncLineOut instanceof Error) throw syncLineOut;
    t.ok(syncLineOut);
    t.ok(syncLineOut.geometry.coordinates);
    t.equal(syncLineOut.geometry.coordinates.length, 250);
    t.end();
})
