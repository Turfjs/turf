import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import clustersKmeans from './';

// Define Fixtures
const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});


/**
 * Benchmark Results
 *
 * fiji: 2.243ms
 * many-points: 35.878ms
 * points-with-properties: 4.576ms
 * points1: 0.203ms
 * points2: 0.103ms
 * fiji x 240,316 ops/sec ±1.24% (87 runs sampled)
 * many-points x 184 ops/sec ±2.42% (82 runs sampled)
 * points-with-properties x 230,182 ops/sec ±2.81% (85 runs sampled)
 * points1 x 66,020 ops/sec ±3.35% (84 runs sampled)
 * points2 x 38,978 ops/sec ±2.10% (88 runs sampled)
 */
const suite = new Benchmark.Suite('turf-clusters-kmeans');
for (const {name, geojson} of fixtures) {
    const {numberOfCentroids} = geojson.properties || {};

    console.time(name);
    clustersKmeans(geojson, numberOfCentroids, true);
    console.timeEnd(name);
    suite.add(name, () => clustersKmeans(geojson, numberOfCentroids, true));
}
suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();

