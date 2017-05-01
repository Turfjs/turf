const test = require('tape');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const write = require('write-json-file');
const random = require('@turf/random');
// const point = require('@turf/helpers').point;
const envelope = require('@turf/envelope');
const matrixToGrid = require('matrix-to-grid');
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

        let breaks,
            points,
            property;
        if (filename.includes('geojson')) {
            breaks = jsondata.properties.breaks;
            property = jsondata.properties.property;
            points = jsondata;
        } else {
            const matrix = jsondata.matrix;
            const cellSize = jsondata.cellSize;
            const origin = jsondata.origin;
            breaks = jsondata.breaks;
            property = jsondata.property;
            points = matrixToGrid(matrix, origin, cellSize, { zProperty: property, units: jsondata.units });
        }

        const results = isobands(points, breaks, property);

        const box = envelope(points);
        box.properties['stroke'] = '#F00';
        box.properties['stroke-width'] = 4;
        results.features.unshift(box); // at the beginning so isobands are clickable

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.equal(results.features[0].geometry.type, 'MultiPolygon', name + ' geometry=MultiPolygon');
        t.deepEqual(results, load.sync(directories.out + filename), name);
    });
    t.end();
});

// test('isobands -- throws', t => {
//     t.throws(() => isobands(random('polygon'), [1, 2, 3]), 'input polygon');
//     t.end();
// });
