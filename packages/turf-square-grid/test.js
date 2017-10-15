import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import squareGrid from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

let fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('square-grid', t => {
    for (const {name, geojson} of fixtures) {
        const {cellSide, units, props} = geojson.properties;
        const result = squareGrid(geojson, cellSide, {
            units: units,
            properties: props,
        });
        // Add styled GeoJSON to the result
        geojson.properties = {
            stroke: '#F00',
            'stroke-width': 6,
            'fill-opacity': 0
        };
        result.features.push(geojson);

        if (process.env.REGEN) write.sync(directories.out + name + '.geojson', result);
        t.deepEqual(result, load.sync(directories.out + name + '.geojson'), name);
    }
    t.end();
});


test('square-grid -- throw', t => {
    const bbox = [0, 0, 1, 1];
    t.throws(() => squareGrid(null, 0), /bbox is required/, 'missing bbox');
    t.throws(() => squareGrid([0, 2], 0), /bbox must contain 4 numbers/, 'invalid bbox');
    t.throws(() => squareGrid(bbox, null), /cellSide is required/, 'missing cellSide');
    t.throws(() => squareGrid(bbox, 'string'), /cellSide is invalid/, 'invalid cellSide');
    t.throws(() => squareGrid(bbox, 1, 'string'), /options is invalid/, 'invalid options');
    t.end();
});
