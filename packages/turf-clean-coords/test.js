const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const helpers = require('@turf/helpers');
const lineString = helpers.lineString;
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
        const {mutate} = geojson.properties;
        const results = cleanCoords(geojson, mutate);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    }
    t.end();
});

test('turf-clean-coords -- throws', t => {
    t.throws(() => cleanCoords(null), /geojson is required/, 'missing geojson');
    t.end();
});

const line = lineString([[0, 0], [1, 1], [2, 2]], {foo: 'bar'});

test('turf-clean-coords -- prevent input mutation', t => {
    const before = JSON.parse(JSON.stringify(line));
    cleanCoords(line);
    t.deepEqual(before, line);
    t.end();
});
