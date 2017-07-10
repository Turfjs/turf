const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const {round} = require('@turf/helpers');
const truncate = require('@turf/truncate');
const chromatism = require('chromatism');
const {featureEach} = require('@turf/meta');
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
        const {property, cellSize, units, weight} = geojson.properties;

        const grid = interpolate(geojson, cellSize, property, units, weight);
        const result = colorize(truncate(grid), property);

        if (process.env.REGEN) write.sync(directories.out + filename, result);
        t.deepEquals(result, load.sync(directories.out + filename), name);
    }
    t.end();
});


// style result
function colorize(grid, property) {
    property = property || 'elevation';
    let max = -Infinity;
    let min = Infinity;
    featureEach(grid, function (point) {
        const value = point.properties[property];
        if (value > max) max = value;
        if (value < min) min = value;
    });
    const delta = (max - min) * 1.1; // extend range to enhance color shade

    featureEach(grid, function (point) {
        const value = point.properties[property];
        const percent = round((value - min) / delta * 100);
        const color = chromatism.brightness(percent, '#002c56').hex;
        point.properties['marker-color'] = color;
    });

    return grid;
}
