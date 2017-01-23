var turfDissolve = require('./index');
var test = require('tape');
var polys = require('./test/polys.json');
var expectedOutput = require('./test/outputPolysByProperty.json');
var expectedOutput2 = require('./test/outputPolysWithNoProperty.json');

test('turf-dissolve', function (t) {

    var dissolved = turfDissolve(polys, 'combine');
    t.equal(dissolved.features.length, 3);
    t.deepEqual(dissolved, expectedOutput);

    var dissolved2 = turfDissolve(polys);
    t.equal(dissolved2.features.length, 2);
    t.deepEqual(dissolved2, expectedOutput2);

    t.end();
});
