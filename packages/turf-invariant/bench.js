const Benchmark = require('benchmark');
const helpers = require('@turf/helpers');
const invariant = require('./');

const point = helpers.point([-75, 40]);
const linestring = helpers.lineString([[-75, 40], [-70, 50]]);
const polygon = helpers.polygon([[[-75, 40], [-80, 50], [-70, 50], [-75, 40]]]);
const featureCollection = helpers.featureCollection([point, point]);

const suite = new Benchmark.Suite('turf-invariant');

suite
    .add('getCoord.point', () => { invariant.getCoord(point); })
    .add('getCoords.linestring', () => { invariant.getCoords(linestring); })
    .add('getCoords.polygon', () => { invariant.getCoords(polygon); })
    .add('collectionOf', () => { invariant.collectionOf(featureCollection, 'Point', 'bench'); })
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
