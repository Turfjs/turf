const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const cleanCoords = require('./');

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

test('turf-clean-coords', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const [feature1, feature2] = geojson.features;
        const results = cleanCoords(feature1, feature2);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    }
    t.end();
});

test('turf-clean-coords -- throws', t => {
    const line = lineString([[10, 10], [12, 15]]);

    t.throws(() => cleanCoords(null), /geojson required/);

    t.end();
});
