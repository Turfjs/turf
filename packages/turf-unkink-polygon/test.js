const fs = require('fs');
const path = require('path');
const test = require('tape');
const unkink = require('./');
const load = require('load-json-file');
const write = require('write-json-file');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {filename, geojson: load.sync(directories.in + filename)};
});

test('unkink-polygon', function (t) {
    for (const fixture of fixtures) {
        // Process
        const unkinked = unkink(fixture.geojson);

        // Save output to GeoJSON for easy preview with GeoJSON.io
        if (process.env.REGEN) { write.sync(directories.out + fixture.filename, unkinked); }

        // Test expected results
        const expected = load.sync(directories.out + fixture.filename);
        t.equals(unkinked.features.length, expected.features.length);
        t.deepEquals(unkinked, expected);
    }
    t.end();
});
