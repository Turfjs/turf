const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const {round, featureCollection, point} = require('@turf/helpers');
const truncate = require('@turf/truncate');
const chromatism = require('chromatism');
const {featureEach, propEach} = require('@turf/meta');
const interpolate = require('./');

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

test('turf-interpolate', t => {
    for (const {filename, name, geojson}  of fixtures) {
        let {property, cellSize, gridType, units, weight} = geojson.properties;
        property = property || 'elevation';

        // Truncate coordinates & elevation (property) to 6 precision
        let grid = truncate(interpolate(geojson, cellSize, gridType, property, units, weight));
        propEach(grid, props => { props[property] = round(props[property]); });
        const result = colorize(grid, property);

        if (process.env.REGEN) write.sync(directories.out + filename, result);
        t.deepEquals(result, load.sync(directories.out + filename), name);
    }
    t.end();
});



test('turf-interpolate -- throws errors', t => {
    const cellSize = 1;
    const property = 'elevation';
    const weight = 0.5;
    const units = 'miles';
    const gridType = 'point';
    const points = featureCollection([
        point([1, 2], {elevation: 200}),
        point([2, 1], {elevation: 300}),
        point([1.5, 1.5], {elevation: 400})
    ]);

    t.assert(interpolate(points, cellSize, gridType, undefined, units, weight).features.length);
    t.throws(() => interpolate(points, undefined, gridType), /cellSize is required/, 'cellSize is required');
    t.throws(() => interpolate(undefined, cellSize, gridType), /points is required/, 'points is required');
    t.throws(() => interpolate(points, cellSize, 'foo', property, units), /invalid gridType/, 'invalid gridType');
    t.throws(() => interpolate(points, cellSize, gridType, property, 'foo'), 'invalid units');
    t.throws(() => interpolate(points, cellSize, gridType, property, units, 'foo'), /weight must be a number/, 'weight must be a number');
    t.throws(() => interpolate(points, cellSize, gridType, 'foo'), /zValue is missing/, 'zValue is missing');
    t.throws(() => interpolate(points, cellSize, gridType, property, units, 'foo'), /weight must be a number/, 'weight must be a number');
    t.end();
});

test('turf-interpolate -- zValue from 3rd coordinate', t => {
    const cellSize = 1;
    const points = featureCollection([
        point([1, 2, 200]),
        point([2, 1, 300]),
        point([1.5, 1.5, 400])
    ]);
    t.assert(interpolate(points, cellSize).features.length, 'zValue from 3rd coordinate');
    t.end();
});

// style result
function colorize(grid, property) {
    property = property || 'elevation';
    let max = -Infinity;
    let min = Infinity;
    featureEach(grid, function (feature) {
        const value = feature.properties[property];
        if (value > max) max = value;
        if (value < min) min = value;
    });
    const delta = (max - min);

    featureEach(grid, function (feature) {
        const value = feature.properties[property];
        const percent = round((value - min - delta / 2) / delta * 100);
        // darker corresponds to higher values
        const color = chromatism.brightness(-percent, '#0086FF').hex;
        if (feature.geometry.type === 'Point') feature.properties['marker-color'] = color;
        else {
            feature.properties['stroke'] = color;
            feature.properties['fill'] = color;
            feature.properties['fill-opacity'] = 0.85;
        }
    });

    return grid;
}
