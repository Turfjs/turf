const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const pointGrid = require('./');

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
// fixtures = fixtures.filter(({name}) => name === 'resolute');

test('turf-point-grid', t => {
    for (const {name, geojson} of fixtures) {
        const {cellSide, units, centered, bboxIsMask} = geojson.properties;
        const result = pointGrid(geojson, cellSide, units, centered, bboxIsMask);

        // Add styled GeoJSON to the result
        geojson.properties = {
            stroke: '#F00',
            'stroke-width': 6,
            'fill-opacity': 0
        };
        result.features.push(geojson);

        if (process.env.REGEN) write.sync(directories.out + name + '.geojson', result);
        t.deepEqual(result, load.sync(directories.out + name + '.geojson'), name);
    }
    t.end();
});

test('turf-point-grid -- throws', t => {
    t.throws(() => pointGrid(null, 10), /bbox is required/, 'missing bbox');
    t.throws(() => pointGrid([-95, 30, 40], 10), /bbox must contain 4 numbers/, 'invalid bbox');
    t.end();
});
