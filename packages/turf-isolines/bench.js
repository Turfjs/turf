const path = require('path');
const Benchmark = require('benchmark');
const load = require('load-json-file');
const fs = require('fs');
const matrixToGrid = require('matrix-to-grid');
const isolines = require('./');

// Define Fixtures
const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        jsondata: load.sync(directory + filename)
    };
});

/**
 * Benchmark Results
 *
 * bigMatrix x 168 ops/sec ±2.79% (72 runs sampled)
 * matrix1 x 17,145 ops/sec ±4.73% (68 runs sampled)
 * matrix2 x 11,004 ops/sec ±2.56% (79 runs sampled)
 * pointGrid x 12,109 ops/sec ±2.01% (77 runs sampled)
 */
const suite = new Benchmark.Suite('turf-isolines');
for (const {name, jsondata, filename} of fixtures) {

    let breaks, points, zProperty, perIsoline, toAllIsolines;
    // allow geojson featureCollection...
    if (filename.includes('geojson')) {
        breaks = jsondata.properties.breaks;
        zProperty = jsondata.properties.zProperty;
        toAllIsolines = jsondata.properties.toAllIsolines;
        perIsoline = jsondata.properties.perIsoline;
        points = jsondata;
    } else {
        // ...or matrix input
        const matrix = jsondata.matrix;
        const cellSize = jsondata.cellSize;
        const origin = jsondata.origin;
        breaks = jsondata.breaks;
        zProperty = jsondata.zProperty;
        points = matrixToGrid(matrix, origin, cellSize, {zProperty, units: jsondata.units});
        toAllIsolines = jsondata.toAllIsolines;
        perIsoline = jsondata.perIsoline;
    }

    isolines(points, breaks, zProperty, {perIsoline, toAllIsolines});

    // isolines(geojson, 'elevation', [5, 45, 55, 65, 85,  95, 105, 120, 180]);
    suite.add(name, () => isolines(points, breaks, zProperty, {perIsoline, toAllIsolines}));
}
suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();

