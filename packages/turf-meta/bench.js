var meta = require('./');
var meta2 = require('./');
var random = require('turf-random');

var n = 100000;
var pnts = random('points', n).features;
var plys = random('polygons', n).features;
var combined = [];

while (pnts.length && plys.length) {
    var pt = pnts.pop();
    var pl = plys.pop();
    combined.push(pt);
    combined.push({ type: 'GeometryCollection', geometries: [pt.geometry, pl.geometry] });
    combined.push(pt.geometry);
    combined.push({ type: 'FeatureCollection', features: [pt] });
    combined.push(pl);
    combined.push(pl.geometry);
    combined.push({ type: 'FeatureCollection', features: [pl] });
}

console.time('coordEach#1');
var sum = 0;
combined.forEach(function(c) {
    meta.coordEach(c, function(coord) {
        sum += coord[0];
    });
});
console.timeEnd('coordEach#1');

console.time('coordEach#2');
var sum = 0;
combined.forEach(function(c) {
    meta2.coordEach(c, function(coord) {
        sum += coord[0];
    });
});
console.timeEnd('coordEach#2');
