const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const {featureCollection, lineString} = require('@turf/helpers');
const lineOffset = require('./');

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
// fixtures = fixtures.filter(fixture => fixture.name === 'polygon');

test('turf-line-offset', t => {
    for (const {name, geojson} of fixtures) {
        let {distance, units} = geojson.properties || {};
        distance = distance || 50;
        const output = truncate(lineOffset(geojson, distance, units), 4);
        output.properties.stroke = '#00F';
        const results = featureCollection([output, geojson]);

        if (process.env.REGEN) write.sync(directories.out + name + '.geojson', results);
        t.deepEqual(results, load.sync(directories.out + name + '.geojson'), name);
    }
    t.end();
});

test('turf-line-offset - Throws Errors', t => {
    const line = lineString([[10, 10], [0, 0]]);
    t.throws(() => lineOffset(), /geojson is required/);
    t.throws(() => lineOffset(line, /offset is required/));
    t.end();
});

test('turf-line-offset - Support Geometry Objects', t => {
    const line = lineString([[10, 10], [0, 0]]);
    t.ok(lineOffset(line.geometry, 10), 'Geometry Object');
    t.end();
});

test('turf-line-offset - Prevent Input Mutation', t => {
    const line = lineString([[10, 10], [0, 0]]);
    const before = JSON.parse(JSON.stringify(line));
    lineOffset(line.geometry, 10);

    t.deepEqual(line, before, 'input does not mutate');
    t.end();
});
