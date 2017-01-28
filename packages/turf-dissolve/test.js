var fs = require('fs');
var dissolve = require('./index');
var test = require('tape');
var path = require('path');

// Define fixtures
var fixtures = {
    polys: require(path.join(__dirname, 'test', 'fixtures', 'in', 'polys.json')),
    out: path.join(__dirname, 'test', 'fixtures', 'out'),
    in: path.join(__dirname, 'test', 'fixtures', 'in')
}

// Helper function
function save(features, out) {
    if (process.env.REGEN) {
        fs.writeFileSync(pathOut + out, JSON.stringify(features, null, 2));
    };
}

test('turf-dissolve', function (t) {
    // With Property
    var dissolved = dissolve(fixtures.polys, 'combine');
    save(dissolved, 'polysByProperty.json')
    t.equal(dissolved.features.length, 3);
    t.deepEqual(dissolved, require(path.join(fixtures.out, 'polysByProperty.json')));

    // Without Property
    var dissolved2 = dissolve(fixtures.polys);
    save(dissolved2, 'polysWithoutProperty.json')
    t.equal(dissolved2.features.length, 2);
    t.deepEqual(dissolved2, require(path.join(fixtures.out, 'polysWithoutProperty.json')));

    t.end();
});
