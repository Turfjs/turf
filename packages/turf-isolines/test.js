const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const random = require('@turf/random');
const envelope = require('@turf/envelope');
const pointGrid = require('@turf/point-grid');
const {getCoords} = require('@turf/invariant');
const matrixToGrid = require('matrix-to-grid');
const {lineString} = require('@turf/helpers');
const isolines = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        jsondata: load.sync(directories.in + filename)
    };
});

test('isolines', t => {
    fixtures.forEach(({name, jsondata, filename}) => {
        const {
            breaks,
            zProperty,
            propertiesPerIsoline,
            propertiesToAllIsolines,
            matrix,
            cellSize,
            units,
            origin} = jsondata.properties || jsondata;

        // allow GeoJSON FeatureCollection or Matrix
        let points;
        if (filename.includes('geojson')) points = jsondata;
        else points = matrixToGrid(matrix, origin, cellSize, {zProperty, units});

        const results = isolines(points, breaks, zProperty, propertiesToAllIsolines, propertiesPerIsoline);

        const box = lineString(getCoords(envelope(points))[0]);
        box.properties['stroke'] = '#F00';
        box.properties['stroke-width'] = 1;
        results.features.push(box);

        if (process.env.REGEN) write.sync(directories.out + name + '.geojson', results);
        t.deepEqual(results, load.sync(directories.out + name + '.geojson'), name);
    });

    t.end();
});

test('isolines -- throws', t => {
    const points = pointGrid([-70.823364, -33.553984, -70.473175, -33.302986], 5);

    t.throws(() => isolines(random('polygon'), [1, 2, 3]), 'invalid points');
    t.throws(() => isolines(points), /breaks is required/);
    t.throws(() => isolines(points, 'string'), /breaks must be an Array/);
    t.throws(() => isolines(points, [1, 2, 3], 5), /zProperty must be a string/);
    t.throws(() => isolines(points, [1, 2, 3], 'temp', 'string'), /propertiesToAllIsolines must be an Object/);
    t.throws(() => isolines(points, [1, 2, 3], 'temp', {}, 'string'), /propertiesPerIsoline must be an Array/);

    t.end();
});

test('isolines -- handling properties', t => {
    const points = pointGrid([-70.823364, -33.553984, -70.473175, -33.302986], 5);
    const propertiesToAllIsolines = {name: 'unknown', source: 'foobar'};
    const propertiesPerIsoline = [{name: 'break1'}, {name: 'break2'}, {name: 'break3'}];

    const lines = isolines(points, [1, 2, 3], 'z', propertiesToAllIsolines, propertiesPerIsoline);
    t.equal(lines.features[0].properties.name, 'break2');
    t.equal(lines.features[0].properties.source, 'foobar');
    t.end();
});
