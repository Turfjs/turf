var test = require('tape');
var path = require('path');
var load = require('load-json-file');
var write = require('write-json-file');
var truncate = require('@turf/truncate');
var grid = require('.');

var directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

var bbox1 = require(directories.in + 'bbox1.json');
var bbox2 = require(directories.in + 'bbox2.json');
var bbox3 = require(directories.in + 'bbox3.json');
var bbox4 = require(directories.in + 'bbox4.json');

test('hex-grid', function (t) {
    var grid1 = truncate(grid(bbox1, 50, 'miles'));
    var grid2 = truncate(grid(bbox2, 5, 'miles'));
    var grid3 = truncate(grid(bbox3, 2, 'miles'));
    var grid4 = truncate(grid(bbox4, 50, 'kilometers'));

    t.ok(grid1.features.length, '50mi grid');
    t.ok(grid2.features.length, '5mi grid');
    t.ok(grid3.features.length, '2mi grid');
    t.ok(grid4.features.length, '50km grid');

    t.equal(grid(bbox1, 100, 'miles').features.length, 85);

    if (process.env.REGEN) {
        write.sync(directories.out + 'grid1.geojson', grid1);
        write.sync(directories.out + 'grid2.geojson', grid2);
        write.sync(directories.out + 'grid3.geojson', grid3);
        write.sync(directories.out + 'grid4.geojson', grid4);
    }
    t.deepEqual(load.sync(directories.out + 'grid1.geojson'), grid1, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'grid2.geojson'), grid2, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'grid3.geojson'), grid3, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'grid4.geojson'), grid4, 'grid is correct');

    t.end();
});

test('hex-tri-grid', function (t) {
    var grid1 = truncate(grid(bbox1, 50, 'miles', true));
    var grid2 = truncate(grid(bbox2, 5, 'miles', true));
    var grid3 = truncate(grid(bbox3, 2, 'miles', true));
    var grid4 = truncate(grid(bbox4, 50, 'kilometers', true));

    t.ok(grid1.features.length, '50mi grid');
    t.ok(grid2.features.length, '5mi grid');
    t.ok(grid3.features.length, '2mi grid');
    t.ok(grid4.features.length, '50km grid');

    t.equal(grid(bbox1, 100, 'miles').features.length, 85);

    if (process.env.REGEN) {
        write.sync(directories.out + 'trigrid1.geojson', grid1);
        write.sync(directories.out + 'trigrid2.geojson', grid2);
        write.sync(directories.out + 'trigrid3.geojson', grid3);
        write.sync(directories.out + 'trigrid4.geojson', grid4);
    }
    t.deepEqual(load.sync(directories.out + 'trigrid1.geojson'), grid1, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'trigrid2.geojson'), grid2, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'trigrid3.geojson'), grid3, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'trigrid4.geojson'), grid4, 'grid is correct');

    t.end();
});
