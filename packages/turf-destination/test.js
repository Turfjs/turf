const write = require('write-json-file');
const load = require('load-json-file');
const fs = require('fs');
const path = require('path');
const test = require('tape');
const destination = require('./');

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

test('turf-destination', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const dist = 100;
        const bear = 180;
        const results = destination(geojson, dist, bear, 'kilometers');

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    }
    t.end();
});
