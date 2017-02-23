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

test('unkink-polygon', function (t) {
    fs.readdirSync(directories.in).forEach(filename => {
        const geojson = load.sync(directories.in + filename);
        const unkinked = unkink(geojson);

        if (process.env.REGEN) { write.sync(directories.out + filename, unkinked); }

        const expected = load.sync(directories.out + filename);
        t.equals(unkinked.features.length, expected.features.length);
        t.deepEquals(unkinked, expected);
    });
    t.end();
});
