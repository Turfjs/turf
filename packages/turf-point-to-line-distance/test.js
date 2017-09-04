const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const circle = require('@turf/circle');
const {point, lineString, round} = require('@turf/helpers');
const pointToLineDistance = require('./');

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

test('turf-point-to-line-distance', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const [point, line] = geojson.features;
        let {units, mercator} = geojson.properties || {};
        if (!units) units = 'kilometers';
        const distance = pointToLineDistance(point, line, units, mercator);

        // debug
        var c = circle(point, distance, 200, units);
        geojson.features.push(c);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        const expected = load.sync(directories.out + 'distances.json');
        t.deepEqual(round(distance, 10), round(expected[name], 10), name);
    }
    t.end();
});

test('turf-point-to-line-distance -- throws', t => {
    const pt = point([0, 0]);
    const line = lineString([[1,1], [-1,1]]);

    t.throws(() => pointToLineDistance(null, line), /point is required/, 'missing point');
    t.throws(() => pointToLineDistance(pt, null), /line is required/, 'missing line');
    t.throws(() => pointToLineDistance(pt, line, 'invalid'), /units is invalid/, 'invalid units');
    t.throws(() => pointToLineDistance(line, line), /Invalid input to point: must be a Point, given LineString/, 'invalid line');
    t.throws(() => pointToLineDistance(pt, pt), /Invalid input to line: must be a LineString, given Point/, 'invalid point');

    t.end();
});
