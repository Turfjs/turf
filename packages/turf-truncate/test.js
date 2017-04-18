const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const point = require('@turf/helpers').point;
const truncate = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

let fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});
// fixtures = fixtures.filter(fixture => fixture.name === 'points');

test('turf-truncate', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const before = JSON.parse(JSON.stringify(geojson));
        const {precision, coordinates} = geojson.properties || {};
        const results = truncate(geojson, precision, coordinates);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(geojson, before, 'prevent input mutation');
        t.deepEqual(results, load.sync(directories.out + filename), name);
    }
    t.end();
});

test('turf-truncate - precision & coordinates', t => {
    t.deepEqual(truncate(point([50.1234567, 40.1234567]), 3).geometry.coordinates, [50.123, 40.123], 'precision 3');
    t.deepEqual(truncate(point([50.1234567, 40.1234567]), 0).geometry.coordinates, [50, 40], 'precision 0');
    t.deepEqual(truncate(point([50, 40, 1100]), 6, 2).geometry.coordinates, [50, 40], 'coordinates 2');
    t.end();
});
