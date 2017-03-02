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
    suite.add('coordEach     - ' + name, () => {
        meta.coordEach(fixture, (currentCoords, currentIndex) => { });
    });
    suite.add('coordReduce   - ' + name, () => {
        meta.coordReduce(fixture, (previousValue, currentCoords, currentIndex) => { });
    });
    suite.add('propEach      - ' + name, () => {
        meta.propEach(fixture, (currentProperties, currentIndex) => { });
    });
    suite.add('propReduce    - ' + name, () => {
        meta.propReduce(fixture, (previousValue, currentProperties, currentIndex) => { });
    });
    suite.add('geomEach      - ' + name, () => {
        meta.geomEach(fixture, (currentGeometry, currentIndex) => { });
    });
    suite.add('geomReduce    - ' + name, () => {
        meta.geomReduce(fixture, (previousValue, currentGeometry, currentIndex) => { });
    });
    suite.add('featureEach   - ' + name, () => {
        meta.featureEach(fixture, (currentFeature, currentIndex) => { });
    });
    suite.add('featureReduce - ' + name, () => {
        meta.featureReduce(fixture, (previousValue, currentFeature, currentIndex) => { });
    });
    suite.add('coordAll      - ' + name, () => {
        meta.coordAll(fixture);
    });
});

suite
  .on('cycle', (event) => { console.log(String(event.target)); })
  .on('complete', () => {})
  .run();
