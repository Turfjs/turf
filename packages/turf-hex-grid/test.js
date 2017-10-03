import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import centroid from '@turf/centroid';
import distance from '@turf/distance';
import truncate from '@turf/truncate';
import hexGrid from '.';

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
    const grid1 = truncate(hexGrid(bbox1, 50, {units: 'miles'}));
    const grid2 = truncate(hexGrid(bbox2, 5, {units: 'miles'}));
    const grid3 = truncate(hexGrid(bbox3, 2, {units: 'miles'}));
    const grid4 = truncate(hexGrid(bbox4, 50, {units: 'kilometers'}));
    const grid5 = truncate(hexGrid(bbox5, 500, {units: 'kilometers'}));

    t.ok(grid1.features.length, '50mi grid');
    t.ok(grid2.features.length, '5mi grid');
    t.ok(grid3.features.length, '2mi grid');
    t.ok(grid4.features.length, '50km grid');
    t.ok(grid5.features.length, '500km grid');

    t.equal(hexGrid(bbox1, 100, {units: 'miles'}).features.length, 85);

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
    const grid1 = truncate(hexGrid(bbox1, 50, {units: 'miles', triangles: true}));
    const grid2 = truncate(hexGrid(bbox2, 5, {units: 'miles', triangles: true}));
    const grid3 = truncate(hexGrid(bbox3, 2, {units: 'miles', triangles: true}));
    const grid4 = truncate(hexGrid(bbox4, 50, {units: 'kilometers', triangles: true}));
    const grid5 = truncate(hexGrid(bbox5, 500, {units: 'kilometers', triangles: true}));

    t.ok(grid1.features.length, '50mi grid');
    t.ok(grid2.features.length, '5mi grid');
    t.ok(grid3.features.length, '2mi grid');
    t.ok(grid4.features.length, '50km grid');
    t.ok(grid5.features.length, '500km grid');

    t.equal(hexGrid(bbox1, 100, {units: 'miles'}).features.length, 85);

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
    const grid = hexGrid(bbox, 500, {units: 'kilometers'});

    const coords = [];
    grid.features.forEach(feature => feature.geometry.coordinates[0].forEach(coord => coords.push(coord)));

    for (const coord of coords) {
        const lng = coord[0];
        const lat = coord[1];
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
    const grid = hexGrid(bbox, 1, {units: 'kilometers'});

    const tile1 = grid.features[0];
    const tile2 = grid.features[1];
    var dist = distance(centroid(tile1), centroid(tile2), 'kilometers');

    t.equal(round(dist, 10), round(Math.sqrt(3) * cellDiameter / 2, 10));

    t.end();
});

function round(value, places) {
    var multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
}
