var test = require('tape');
var truncate = require('./');
var path = require('path');
var load = require('load-json-file');
var write = require('write-json-file');

var directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

test('truncate', (t) => {
    var point = load.sync(directories.in + 'point.json');
    var points = load.sync(directories.in + 'points.json');
    var pointElevation = load.sync(directories.in + 'pointElevation.json');
    var polygon = load.sync(directories.in + 'polygon.json');
    var polygons = load.sync(directories.in + 'polygons.json');

    var pointTruncate = truncate(point);
    var pointsTruncate = truncate(points);
    var pointElevationTruncate = truncate(pointElevation, 6, true);
    var polygonTruncate = truncate(polygon);
    var polygonsTruncate = truncate(polygons);
    var polygonsTruncateDecimal3 = truncate(polygons, 3);

    if (process.env.REGEN) {
        write.sync(directories.out + 'pointTruncate.json', pointTruncate);
        write.sync(directories.out + 'pointsTruncate.json', pointsTruncate);
        write.sync(directories.out + 'pointElevationTruncate.json', pointElevationTruncate);
        write.sync(directories.out + 'polygonTruncate.json', polygonTruncate);
        write.sync(directories.out + 'polygonsTruncate.json', polygonsTruncate);
        write.sync(directories.out + 'polygonsTruncateDecimal3.json', polygonsTruncateDecimal3);
    }

    t.deepEqual(pointTruncate, load.sync(directories.out + 'pointTruncate.json'), 'pointTruncate');
    t.deepEqual(pointsTruncate, load.sync(directories.out + 'pointsTruncate.json'), 'pointsTruncate');
    t.deepEqual(pointElevationTruncate, load.sync(directories.out + 'pointElevationTruncate.json'), 'pointElevationTruncate');
    t.deepEqual(polygonTruncate, load.sync(directories.out + 'polygonTruncate.json'), 'polygonTruncate');
    t.deepEqual(polygonsTruncate, load.sync(directories.out + 'polygonsTruncate.json'), 'polygonsTruncate');
    t.deepEqual(polygonsTruncateDecimal3, load.sync(directories.out + 'polygonsTruncateDecimal3.json'), 'polygonsTruncateDecimal3');
    t.end();
});
