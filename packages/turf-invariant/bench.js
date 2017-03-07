var Benchmark = require('benchmark');
var helpers = require('@turf/helpers');
var invariant = require('./');

const fixtures = [
    {name: 'Point', geojson: helpers.point([-75, 40])},
    {name: 'LineString', geojson: helpers.lineString([[-75, 40], [-70, 50]])},
    {name: 'Polygon', geojson: helpers.polygon([[[-75, 40], [-80, 50], [-70, 50], [-75, 40]]])}
];

var suite = new Benchmark.Suite('turf-invariant');

for (const {name, geojson} of fixtures) {
    suite
        .add('getCoord.' + name, () => { invariant.getCoord(geojson); })
        .add('geojsonType.' + name, () => { invariant.geojsonType(geojson, 'Feature', name); });
}
suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
