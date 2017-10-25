import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import bboxPoly from '@turf/bbox-polygon';
import truncate from '@turf/truncate';
import {point} from '@turf/helpers';
import pointGrid from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

let fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        json: load.sync(directories.in + filename)
    };
});

test('turf-point-grid', t => {
    for (const {name, json} of fixtures) {
        const {bbox, cellSide} = json;
        const options = json;
        const result = truncate(pointGrid(bbox, cellSide, options));

        // Add styled GeoJSON to the result
        const poly = bboxPoly(bbox);
        poly.properties = {
            stroke: '#F00',
            'stroke-width': 6,
            'fill-opacity': 0
        };
        result.features.push(poly);
        if (options.mask) {
            options.mask.properties = {
                "stroke": "#00F",
                "stroke-width": 6,
                "fill-opacity": 0
            };
            result.features.push(options.mask);
        }

        if (process.env.REGEN) write.sync(directories.out + name + '.geojson', result);
        t.deepEqual(result, load.sync(directories.out + name + '.geojson'), name);
    }
    t.end();
});


test('point-grid -- throw', t => {
    const bbox = [0, 0, 1, 1];
    t.throws(() => pointGrid(null, 0), /bbox is required/, 'missing bbox');
    t.throws(() => pointGrid('foo', 0), /bbox must be array/, 'invalid bbox');
    t.throws(() => pointGrid([0, 2], 1), /bbox must contain 4 numbers/, 'invalid bbox');
    t.throws(() => pointGrid(bbox, null), /cellSide is required/, 'missing cellSide');
    t.throws(() => pointGrid(bbox, 'foo'), /cellSide is invalid/, 'invalid cellSide');
    t.throws(() => pointGrid(bbox, 1, 'foo'), /options is invalid/, 'invalid options');
    t.throws(() => pointGrid(bbox, 1, {mask: point([0, 10])}), /options.mask must be a \(Multi\)Polygon/, 'invalid options.mask');
    t.end();
});
