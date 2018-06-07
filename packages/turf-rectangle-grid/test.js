/*import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import rectangleGrid from '.';

test('turf-rectangle_grid', t => {
  glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
    // Define params
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    // etc.

    const results = [];
    const out = filepath.replace(path.join('test', 'in'), path.join('test', 'out'));
    if (process.env.REGEN) write.sync(out, results);
    t.deepEqual(results, load.sync(out), name);
  });
  t.end();
});

*/

const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const bboxPoly = require('@turf/bbox-polygon').default;
const truncate = require('@turf/truncate').default;
const rectangleGrid = require('./').default;

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

test('rectangle-grid', t => {
    for (const {name, json} of fixtures) {
        const {bbox, cellWidth, cellHeight, units, properties, mask} = json;
        const options = {
            mask,
            units,
            properties,
        }
        const result = truncate(rectangleGrid(bbox, cellWidth, cellHeight, options));

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
