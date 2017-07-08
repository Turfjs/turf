const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const centroid = require('@turf/centroid');
const distance = require('@turf/distance');
const truncate = require('@turf/truncate');
const grid = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const bbox1 = require(directories.in + 'bbox1.json');
const bbox2 = require(directories.in + 'bbox2.json');
const bbox3 = require(directories.in + 'bbox3.json');
const bbox4 = require(directories.in + 'bbox4.json');
const bbox5 = require(directories.in + 'bbox5.json');

test('hex-grid', t => {
    const grid1 = truncate(grid(bbox1, 50, 'miles'));
    const grid2 = truncate(grid(bbox2, 5, 'miles'));
    const grid3 = truncate(grid(bbox3, 2, 'miles'));
    const grid4 = truncate(grid(bbox4, 50, 'kilometers'));
    const grid5 = truncate(grid(bbox5, 500, 'kilometers'));

    t.ok(grid1.features.length, '50mi grid');
    t.ok(grid2.features.length, '5mi grid');
    t.ok(grid3.features.length, '2mi grid');
    t.ok(grid4.features.length, '50km grid');
    t.ok(grid5.features.length, '500km grid');

    t.equal(grid(bbox1, 100, 'miles').features.length, 85);

    if (process.env.REGEN) {
        write.sync(directories.out + 'grid1.geojson', grid1);
        write.sync(directories.out + 'grid2.geojson', grid2);
        write.sync(directories.out + 'grid3.geojson', grid3);
        write.sync(directories.out + 'grid4.geojson', grid4);
        write.sync(directories.out + 'grid5.geojson', grid5);
    }
    t.deepEqual(load.sync(directories.out + 'grid1.geojson'), grid1, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'grid2.geojson'), grid2, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'grid3.geojson'), grid3, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'grid4.geojson'), grid4, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'grid5.geojson'), grid5, 'grid is correct');

    t.end();
});

test('hex-tri-grid', t => {
    const grid1 = truncate(grid(bbox1, 50, 'miles', true));
    const grid2 = truncate(grid(bbox2, 5, 'miles', true));
    const grid3 = truncate(grid(bbox3, 2, 'miles', true));
    const grid4 = truncate(grid(bbox4, 50, 'kilometers', true));
    const grid5 = truncate(grid(bbox5, 500, 'kilometers', true));

    t.ok(grid1.features.length, '50mi grid');
    t.ok(grid2.features.length, '5mi grid');
    t.ok(grid3.features.length, '2mi grid');
    t.ok(grid4.features.length, '50km grid');
    t.ok(grid5.features.length, '500km grid');

    t.equal(grid(bbox1, 100, 'miles').features.length, 85);

    if (process.env.REGEN) {
        write.sync(directories.out + 'trigrid1.geojson', grid1);
        write.sync(directories.out + 'trigrid2.geojson', grid2);
        write.sync(directories.out + 'trigrid3.geojson', grid3);
        write.sync(directories.out + 'trigrid4.geojson', grid4);
        write.sync(directories.out + 'trigrid5.geojson', grid5);
    }
    t.deepEqual(load.sync(directories.out + 'trigrid1.geojson'), grid1, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'trigrid2.geojson'), grid2, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'trigrid3.geojson'), grid3, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'trigrid4.geojson'), grid4, 'grid is correct');
    t.deepEqual(load.sync(directories.out + 'trigrid5.geojson'), grid5, 'grid is correct');

    t.end();
});

test('longitude (13141439571036224) - issue #758', t => {
    const bbox = [-179, -90, 179, 90];
    const hexgrid = grid(bbox, 500, 'kilometers');

    const coords = [];
    hexgrid.features.forEach(feature => feature.geometry.coordinates[0].forEach(coord => coords.push(coord)));

    for (const [lng, lat] of coords) {
        if (lng > 1000 || lng < -1000) {
            t.fail(`longitude is +- 1000 [${lng},${lat}]`);
            break;
        }
    }
    t.end();
});

test('hexagon size - issue #623', t => {
    const bbox = [9.244, 45.538, 9.115, 45.439];
    const cellDiameter = 1;
    const hexgrid = grid(bbox, 1, 'kilometers');

    const tile1 = hexgrid.features[0];
    const tile2 = hexgrid.features[1];
    var dist = distance(centroid(tile1), centroid(tile2), "kilometers");

    t.equal(round(dist, 10), round(Math.sqrt(3) * cellDiameter / 2, 10));

    t.end();
});


function round(value, places) {
    var multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
}
