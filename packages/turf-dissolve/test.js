var fs = require('fs');
var dissolve = require('./index');
var test = require('tape');
var path = require('path');

var directories = {
    out: path.join(__dirname, 'test', 'out'),
    in: path.join(__dirname, 'test', 'in')
}

function save(directory, filename, features) {
    return fs.writeFileSync(path.join(directory, filename), JSON.stringify(features, null, 2))
}

function read(directory, filename) {
    return JSON.parse(fs.readFileSync(path.join(directory, filename), 'utf8'))
}

test('turf-dissolve', function (t) {
    var polys = read(directories.in, 'polys.geojson');

    // With Property
    var polysByProperty = dissolve(polys, 'combine');
    if (process.env.REGEN) { save(directories.out, 'polysByProperty.geojson', polysByProperty); }
    t.equal(polysByProperty.features.length, 3);
    t.deepEqual(polysByProperty, read(directories.out, 'polysByProperty.geojson'));

    // Without Property
    var polysWithoutProperty = dissolve(polys);
    if (process.env.REGEN) { save(directories.out, 'polysWithoutProperty.geojson', polysWithoutProperty); }
    t.equal(polysWithoutProperty.features.length, 2);
    t.deepEqual(polysWithoutProperty, read(directories.out, 'polysWithoutProperty.geojson'));

    t.end();
});
