import fs from 'fs';
import path from 'path';
import test from 'tape';
import nearestPoint from '.';

test('nearest-point', t => {
    var pt = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'pt.geojson')));
    var pts = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'pts.geojson')));

    var closestPt = nearestPoint(pt, pts);

    t.ok(closestPt, 'should return a point');
    t.equal(closestPt.geometry.type, 'Point', 'should be a point');
    t.equal(closestPt.geometry.coordinates[0], -75.33, 'lon -75.33');
    t.equal(closestPt.geometry.coordinates[1], 39.44, 'lat 39.44');
    t.end();
});
