import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import matrixToGrid from 'matrix-to-grid';
import isolines from './';

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

    suite.add(name, () => isolines(points, breaks, {
        zProperty,
        propertiesToAllIsolines,
        propertiesPerIsoline
    }));
}
suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();

