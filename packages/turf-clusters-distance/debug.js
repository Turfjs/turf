const clusters = require('./');
const load = require('load-json-file');
const {point, featureCollection} = require('@turf/helpers');

var points = featureCollection([
    point([-75, 45], {foo: 'bar1'}),
    point([3, 4], {foo: 'bar2'}),
    point([2, 2], {foo: 'bar3'}),
    point([1, 2], {foo: 'bar4'})
]);
var points1 = load.sync('test/in/points1.geojson');
console.log(clusters(points1, 100));
