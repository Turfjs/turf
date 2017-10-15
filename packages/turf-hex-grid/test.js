import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import truncate from '@turf/truncate';
import hexGrid from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        json: load.sync(directories.in + filename)
    };
});

test('hex-grid', t => {
    fixtures.forEach(({name, json, filename}) => {
        const bbox = json.bbox;
        const cellSide = json.cellSide;
        const units = json.units || 'kilometers';

        const results = truncate(hexGrid(bbox, cellSide, {units}));

        if (process.env.REGEN) write.sync(directories.out + name + '-grid.geojson', results);
        t.deepEqual(results, load.sync(directories.out + name + '-grid.geojson'), name);
    });
    t.end();
});

test('triangle-grid', t => {
    fixtures.forEach(({name, json, filename}) => {
        const bbox = json.bbox;
        const cellSide = json.cellSide;
        const units = json.units || 'kilometers';

        const results = truncate(hexGrid(bbox, cellSide, {units, triangles: true}));

        if (process.env.REGEN) write.sync(directories.out + name + '-trigrid.geojson', results);
        t.deepEqual(results, load.sync(directories.out + name + '-trigrid.geojson'), name);
    });
    t.end();
});

test('grid tiles count', t => {
    const bbox1 = require(directories.in + 'bbox1.json').bbox;
    t.equal(hexGrid(bbox1, 50, {units: 'miles'}).features.length, 85);
    t.equal(hexGrid(bbox1, 50, {units: 'miles', triangles: true}).features.length, 510);

    t.end();
});

test('longitude (13141439571036224) - issue #758', t => {
    const bbox = [-179, -90, 179, 90];
    const grid = hexGrid(bbox, 250, {units: 'kilometers'});

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


test('hex-grid -- throw', t => {
    const bbox = [0, 0, 1, 1];
    t.throws(() => hexGrid(null, 0), /bbox is required/, 'missing bbox');
    t.throws(() => hexGrid([0, 2], 1), /bbox must contain 4 numbers/, 'invalid bbox');
    t.throws(() => hexGrid(bbox, null), /cellSide is required/, 'missing cellSide');
    t.throws(() => hexGrid(bbox, 'string'), /cellSide is invalid/, 'invalid cellSide');
    t.throws(() => hexGrid(bbox, 1, 'string'), /options is invalid/, 'invalid options');
    t.end();
});

