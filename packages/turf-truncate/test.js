var test = require('tape');
var truncate = require('./');
var path = require('path');
var load = require('load-json-file');
var write = require('write-json-file');

var directories = {
    in: path.join(__dirname, 'test', 'in'),
    out: path.join(__dirname, 'test', 'out')
};

test('truncate', (t) => {
    var point = load.sync(path.join(directories.in, 'point.json'));
    var points = load.sync(path.join(directories.in, 'points.json'));
    var pointElevation = load.sync(path.join(directories.in, 'pointElevation.json'));
    var polygon = load.sync(path.join(directories.in, 'polygon.json'));
    var polygons = load.sync(path.join(directories.in, 'polygons.json'));

    var pointTruncate = truncate(point);
    var pointsTruncate = truncate(points);
    var pointElevationTruncate = truncate(pointElevation, 6, true);
    var polygonTruncate = truncate(polygon);
    var polygonsTruncate = truncate(polygons);
    var polygonsTruncateDecimal3 = truncate(polygons, 3);

    if (process.env.REGEN) {
        write.sync(path.join(directories.out, 'pointTruncate.json'), pointTruncate);
        write.sync(path.join(directories.out, 'pointsTruncate.json'), pointsTruncate);
        write.sync(path.join(directories.out, 'pointElevationTruncate.json'), pointElevationTruncate);
        write.sync(path.join(directories.out, 'polygonTruncate.json'), polygonTruncate);
        write.sync(path.join(directories.out, 'polygonsTruncate.json'), polygonsTruncate);
        write.sync(path.join(directories.out, 'polygonsTruncateDecimal3.json'), polygonsTruncateDecimal3);
    }

    t.deepEqual(pointTruncate, load.sync(path.join(directories.out, 'pointTruncate.json')), 'pointTruncate');
    t.deepEqual(pointsTruncate, load.sync(path.join(directories.out, 'pointsTruncate.json')), 'pointsTruncate');
    t.deepEqual(pointElevationTruncate, load.sync(path.join(directories.out, 'pointElevationTruncate.json')), 'pointElevationTruncate');
    t.deepEqual(polygonTruncate, load.sync(path.join(directories.out, 'polygonTruncate.json')), 'polygonTruncate');
    t.deepEqual(polygonsTruncate, load.sync(path.join(directories.out, 'polygonsTruncate.json')), 'polygonsTruncate');
    t.deepEqual(polygonsTruncateDecimal3, load.sync(path.join(directories.out, 'polygonsTruncateDecimal3.json')), 'polygonsTruncateDecimal3');
    t.end();
});
