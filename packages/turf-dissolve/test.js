var turfDissolve = require('./index');
var test = require('tape');
var polys = require('./test/polys.json');
var expectedOutput = require('./test/outputPolys.json');

test('turf-dissolve', function (t) {

    var aggregated = turfDissolve(polys, 'combine');
    t.equal(aggregated.features.length, 3);
    t.deepEqual(aggregated, expectedOutput);

    t.end();
});
