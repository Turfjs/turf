const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const {point} = require('@turf/helpers');
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
        const results = flip(geojson);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(load.sync(directories.out + filename), results, name);
    }
    t.end();
});

test('turf-flip - handle input mutation', t => {
    const geojson = point([120, 40])
    flip(geojson)
    t.deepEqual(geojson, point([120, 40]), 'does not mutate input');
    flip(geojson, true)
    t.deepEqual(geojson, point([40, 120]), 'does mutate input');
    t.end()
})