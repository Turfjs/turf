const Benchmark = require('benchmark');
const {featureCollection, point} = require('@turf/helpers');
const {getCluster, clusterEach, clusterReduce} = require('./');
const {propertiesContainsFilter, filterProperties, applyFilter, createBins} = require('./'); // Testing Purposes

const geojson = featureCollection([
    point([0, 0], {cluster: 0}),
    point([2, 4], {cluster: 1}),
    point([3, 6], {cluster: 1}),
    point([5, 1], {0: 'foo'}),
    point([4, 2], {'bar': 'foo'}),
    point([2, 4], {}),
    point([4, 3], undefined)
]);

/**
 * Benchmark Results
 *
 * testing -- createBins x 2,954,562 ops/sec ±1.29% (89 runs sampled)
 * testing -- propertiesContainsFilter x 10,902,619 ops/sec ±2.11% (85 runs sampled)
 * testing -- filterProperties x 27,860,084 ops/sec ±1.12% (88 runs sampled)
 * testing -- applyFilter x 18,971,594 ops/sec ±7.14% (77 runs sampled)
 * getCluster -- string filter x 5,873,843 ops/sec ±1.30% (87 runs sampled)
 * getCluster -- object filter x 883,469 ops/sec ±1.28% (93 runs sampled)
 * getCluster -- aray filter x 3,602,147 ops/sec ±1.30% (89 runs sampled)
 * clusterEach x 1,133,904 ops/sec ±0.90% (89 runs sampled)
 * clusterReduce x 1,057,572 ops/sec ±1.13% (89 runs sampled)
 */
const suite = new Benchmark.Suite('turf-clusters');

// Testing Purposes
suite
  .add('testing -- createBins', () => createBins(geojson.features, 'cluster'))
  .add('testing -- propertiesContainsFilter', () => propertiesContainsFilter({foo: 'bar', cluster: 0}, {cluster: 0}))
  .add('testing -- filterProperties', () => filterProperties({foo: 'bar', cluster: 0}, ['cluster']))
  .add('testing -- applyFilter', () => applyFilter({foo: 'bar', cluster: 0}, ['cluster']));

suite
  .add('getCluster -- string filter', () => getCluster(geojson, 'cluster'))
  .add('getCluster -- object filter', () => getCluster(geojson, {cluster: 1}))
  .add('getCluster -- aray filter', () => getCluster(geojson, ['cluster']))
  .add('clusterEach', () => clusterEach(geojson, 'cluster', cluster => { return cluster; }))
  .add('clusterReduce', () => clusterReduce(geojson, 'cluster', (previousValue, cluster) => { return cluster; }))
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
