const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const dissolve = require('./');

const directories = {
    out: path.join(__dirname, 'test', 'out') + path.sep,
    in: path.join(__dirname, 'test', 'in') + path.sep
};

test('turf-dissolve', t => {
    const polys = load.sync(directories.in + 'polys.geojson');

    // With Property
    const polysByProperty = dissolve(polys, 'combine');
    if (process.env.REGEN) write.sync(directories.out + 'polysByProperty.geojson', polysByProperty);
    t.equal(polysByProperty.features.length, 3);
    t.deepEqual(polysByProperty, load.sync(directories.out + 'polysByProperty.geojson'));

    // Without Property
    const polysWithoutProperty = dissolve(polys);
    if (process.env.REGEN) write.sync(directories.out + 'polysWithoutProperty.geojson', polysWithoutProperty);
    t.equal(polysWithoutProperty.features.length, 2);
    t.deepEqual(polysWithoutProperty, load.sync(directories.out + 'polysWithoutProperty.geojson'));

    t.end();
});
