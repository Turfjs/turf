var fs = require('fs');
var dissolve = require('./index');
var test = require('tape');
var path = require('path');
var pathOut = path.join(__dirname, 'test', 'fixtures', 'out/');

function save(features, out) {
    if (process.env.REGEN) {
        fs.writeFileSync(pathOut + out, JSON.stringify(features, null, 2));
    };
}

test('turf-dissolve', function (t) {
    // Input Fixtures
    var polys = require('./test/fixtures/in/polys.json');

    // With Property
    var dissolved = dissolve(polys, 'combine');
    save(dissolved, 'polysByProperty.json')
    t.equal(dissolved.features.length, 3);
    t.deepEqual(dissolved, require(pathOut + 'polysByProperty.json'));

    // Without Property
    var dissolved2 = dissolve(polys);
    save(dissolved2, 'polysWithoutProperty.json')
    t.equal(dissolved2.features.length, 2);
    t.deepEqual(dissolved2, require(pathOut + 'polysWithoutProperty.json'));

    t.end();
});
