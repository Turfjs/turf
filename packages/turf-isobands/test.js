const test = require('tape');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const write = require('write-json-file');
const random = require('@turf/random');
const envelope = require('@turf/envelope');
const helpers = require('@turf/helpers');
const lineString = helpers.lineString;
const getCoords = require('@turf/invariant').getCoords;
const matrixToGrid = require('matrix-to-grid');
const pointGrid = require('@turf/point-grid');
const isobands = require('./');

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

test('isobands', t => {
    fixtures.forEach(({name, jsondata, filename}) => {

        let breaks, points, zProperty, isobandProperties, commonProperties;
        // allow geojson featureCollection...
        if (filename.includes('geojson')) {
            breaks = jsondata.properties.breaks;
            zProperty = jsondata.properties.zProperty;
            commonProperties = jsondata.properties.commonProperties;
            isobandProperties = jsondata.properties.isobandProperties;
            points = jsondata;
        } else {
            // ...or matrix input
            const matrix = jsondata.matrix;
            const cellSize = jsondata.cellSize;
            const origin = jsondata.origin;
            breaks = jsondata.breaks;
            zProperty = jsondata.zProperty;
            points = matrixToGrid(matrix, origin, cellSize, { zProperty, units: jsondata.units });
            commonProperties = jsondata.commonProperties;
            isobandProperties = jsondata.isobandProperties;
        }

        const results = isobands(points, breaks, zProperty, {
            commonProperties,
            isobandProperties
        });

        const box = lineString(getCoords(envelope(points))[0]);
        box.properties['stroke'] = '#F00';
        box.properties['stroke-width'] = 1;
        results.features.push(box);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    });

    t.end();
});

test('isobands -- throws', t => {
    const points = pointGrid([-70.823364, -33.553984, -70.473175, -33.302986], 5);

    t.throws(() => isobands(random('polygon'), [1, 2, 3]), 'invalid points');
    t.throws(() => isobands(points, ''), 'invalid breaks');
    t.throws(() => isobands(points, [1, 2, 3], 'temp', { isobandProperties: 'hello' }), 'invalid options');

    t.end();
});
