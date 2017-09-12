const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const {featureCollection, point, lineString, round} = require('@turf/helpers');
const nearestPointToLine = require('./');

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

test('turf-nearest-point-to-line', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const [points, line] = geojson.features;
        let {units} = geojson.properties || {};
        const nearest = nearestPointToLine(points, line, units);
        nearest.properties.dist = round(nearest.properties.dist, 13);
        nearest.properties = Object.assign(nearest.properties, {
            'marker-color': '#F00',
            'marker-size': 'large',
            'marker-symbol': 'star'
        });
        const results = featureCollection([nearest, line]);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    }
    t.end();
});


test('turf-nearest-point-to-line -- throws', t => {
    const points = featureCollection([point([0, 0]), point([0, 1])]);
    const line = lineString([[1,1], [-1,1]]);

    t.throws(() => nearestPointToLine(null, line), /points is required/, 'missing points');
    t.throws(() => nearestPointToLine(points, null), /line is required/, 'missing line');

    t.throws(() => nearestPointToLine(points, line, 'invalid'), /units is invalid/, 'invalid units');
    t.throws(() => nearestPointToLine(points, points), /Invalid input to line, Feature with geometry required/, 'invalid line');
    t.throws(() => nearestPointToLine(line, line), /Invalid input to points, FeatureCollection required/, 'invalid points');

    t.end();
});
