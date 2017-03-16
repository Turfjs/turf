const fs = require('fs');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const write = require('write-json-file');
const unkink = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {filename, geojson: load.sync(directories.in + filename)};
});

test('unkink-polygon', t => {
    for (const {filename, geojson} of fixtures) {
        const unkinked = unkink(geojson);

        if (process.env.REGEN) { write.sync(directories.out + filename, unkinked); }

        const expected = load.sync(directories.out + filename);
        t.deepEquals(unkinked, expected, path.parse(filename).name);
    }
    t.end();
});

test('unkink-polygon -- throws', t => {
    var array = [1, 2, 3, 4, 5];
    for (const value in array) {
        t.true(value !== 'isUnique', 'isUnique');
        t.true(value !== 'getUnique', 'getUnique');
    }
    t.throws(() => Array.isUnique(), 'isUnique()');
    t.throws(() => Array.getUnique(), 'getUnique()');
    t.end();
});
