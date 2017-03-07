const Benchmark = require('benchmark');
const helpers = require('@turf/helpers');
const invariant = require('./');

const point = helpers.point([-75, 40]);
const linestring = helpers.lineString([[-75, 40], [-70, 50]]);
const polygon = helpers.polygon([[[-75, 40], [-80, 50], [-70, 50], [-75, 40]]]);

const fixtures = [
    {name: 'Point', geojson: point},
    {name: 'LineString', geojson: linestring},
    {name: 'Polygon', geojson: polygon}
];
const featureCollection = helpers.featureCollection([point, point]);

const suite = new Benchmark.Suite('turf-invariant');

for (const {name, geojson} of fixtures) {
    suite.add('getCoord.' + name, () => { invariant.getCoord(geojson); });
    suite.add('geojsonType.' + name, () => { invariant.geojsonType(geojson, 'Feature', name); });
}
suite.add('collectionOf', () => { invariant.collectionOf(featureCollection, 'Point', 'bench'); });
suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
