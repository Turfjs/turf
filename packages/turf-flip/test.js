const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const flip = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('turf-flip', t => {
    for (const {name, filename, geojson} of fixtures) {
        const before = JSON.parse(JSON.stringify(geojson));
        const results = flip(geojson);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(before, geojson, 'input mutation');
        t.deepEqual(load.sync(directories.out + filename), results, name);
    }
    t.end();
});
