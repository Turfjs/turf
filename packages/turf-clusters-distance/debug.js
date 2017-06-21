const clustersDistance = require('./');
const load = require('load-json-file');

var points1 = load.sync('test/in/points1.geojson');
console.log(clustersDistance(points1, 100));
