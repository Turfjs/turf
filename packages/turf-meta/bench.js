const Benchmark = require('benchmark');
const random = require('@turf/random');
const meta = require('.');

const fixtures = {
    point: random('points'),
    points: random('points', 1000),
    polygon: random('polygon'),
    polygons: random('polygons', 1000)
};

const suite = new Benchmark.Suite('turf-meta');

Object.keys(fixtures).forEach(name => {
    const fixture = fixtures[name];
    suite.add('coordEach#' + name, () => {
        meta.coordEach(fixture, (coords, index) => { });
    });
    suite.add('coordReduce#' + name, () => {
        meta.coordReduce(fixture, (previousValue, currentCoords, index) => { });
    });
    suite.add('coordAll#' + name, () => {
        meta.coordAll(fixture);
    });
});

suite
  .on('cycle', (event) => { console.log(String(event.target)); })
  .on('complete', () => {})
  .run();
