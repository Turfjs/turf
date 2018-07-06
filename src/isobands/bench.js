import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import matrixToGrid from './matrix-to-grid';
import isobands from './';

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
 * bigMatrix x 73.43 ops/sec ±2.12% (62 runs sampled)
 * matrix1 x 5,205 ops/sec ±3.13% (78 runs sampled)
 * matrix2 x 2,333 ops/sec ±9.38% (71 runs sampled)
 * pointGrid x 3,201 ops/sec ±1.81% (78 runs sampled)
 */
const suite = new Benchmark.Suite('turf-isobands');
for (const {name, jsondata, filename} of fixtures) {

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
        points = matrixToGrid(matrix, origin, cellSize, {zProperty, units: jsondata.units});
        commonProperties = jsondata.commonProperties;
        isobandProperties = jsondata.isobandProperties;
    }

    isobands(points, breaks, {
        zProperty,
        commonProperties,
        isobandProperties
    });

    // isobands(geojson, 'elevation', [5, 45, 55, 65, 85,  95, 105, 120, 180]);
    suite.add(name, () => isobands(points, breaks, {
            zProperty,
            commonProperties,
            isobandProperties
        })
    );
}
suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
