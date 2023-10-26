const Benchmark = require('benchmark');
const {randomPoint, randomPolygon} = require('@turf/random');
const geojsonRbush = require('./').default;

// Fixtures
const points = randomPoint(3);
const point = points.features[0];
const polygons = randomPolygon(3);
const polygon = polygons.features[0];

// Load trees before (used to benchmark search)
const pointsTree = geojsonRbush();
pointsTree.load(points);
const polygonsTree = geojsonRbush();
polygonsTree.load(polygons);

/**
 * Benchmark Results
 *
 * rbush.points x 313,979 ops/sec ±10.60% (67 runs sampled)
 * rbush.polygons x 428,333 ops/sec ±1.69% (70 runs sampled)
 * search.points x 5,986,675 ops/sec ±7.95% (77 runs sampled)
 * search.polygons x 6,481,248 ops/sec ±0.93% (90 runs sampled)
 */
new Benchmark.Suite('geojson-rbush')
    .add('rbush.points', () => {
        const tree = geojsonRbush();
        tree.load(points);
    })
    .add('rbush.polygons', () => {
        const tree = geojsonRbush();
        tree.load(polygons);
    })
    .add('search.points', () => pointsTree.search(point))
    .add('search.polygons', () => polygonsTree.search(polygon))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
