const Benchmark = require('benchmark');
const {point, lineString, polygon, featureCollection} = require('@turf/helpers');
const clone = require('./');

const fixtures = [
    point([0, 20]),
    lineString([[10, 40], [0, 20]]),
    polygon([[[10, 40], [0, 20], [20, 0], [10, 40]]]),
    featureCollection([
        point([0, 20]),
        lineString([[10, 40], [0, 20]]),
        polygon([[[10, 40], [0, 20], [20, 0], [10, 40]]])
    ])
];

/**
 * Benchmark Results
 *
 * Point: 0.149ms
 * LineString: 0.036ms
 * Polygon: 0.067ms
 * FeatureCollection: 0.043ms
 * Point x 6,972,739 ops/sec ±5.50% (86 runs sampled)
 * Point -- clones entire object x 357,437 ops/sec ±0.95% (88 runs sampled)
 * LineString x 1,502,039 ops/sec ±1.01% (86 runs sampled)
 * LineString -- clones entire object x 291,562 ops/sec ±1.00% (88 runs sampled)
 * Polygon x 723,111 ops/sec ±1.06% (87 runs sampled)
 * Polygon -- clones entire object x 227,034 ops/sec ±0.62% (91 runs sampled)
 * FeatureCollection x 370,012 ops/sec ±1.25% (87 runs sampled)
 * FeatureCollection -- clones entire object x 91,582 ops/sec ±0.81% (86 runs samp
led)
 */
const suite = new Benchmark.Suite('turf-clone');
for (const fixture of fixtures) {
    const name = (fixture.geometry) ? fixture.geometry.type : fixture.type;
    console.time(name);
    clone(fixture, true);
    console.timeEnd(name);
    suite.add(name, () => clone(fixture));
    suite.add(name + ' -- clones entire object', () => clone(fixture, true));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
