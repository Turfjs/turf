import fs from 'fs';
import path from 'path';
import test from 'tape';
import load from 'load-json-file';
import write from 'write-json-file';
import glob from 'glob';
import { featureEach } from '../meta';
import { featureCollection } from '../helpers';
import kinks from '../kinks';
import unkinkPolygon from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

test('unkink-polygon', t => {
    glob.sync(directories.in + '*.geojson').forEach(filepath => {
        const { name, base } = path.parse(filepath);
        const geojson = load.sync(filepath);

        const unkinked = unkinkPolygon(geojson);

        // Detect if kinks exists
        featureEach(unkinked, feature => {
            // Throw Error when Issue #1094 is fixed
            if (kinks(feature).features.length) t.skip(filepath + ' has kinks')
        })

        // Style results
        const results = colorize(unkinked);
        if (process.env.REGEN) write.sync(directories.out + base, results);
        t.deepEqual(results, load.sync(directories.out + base), name);
    })
    t.end();
});

test('unkink-polygon -- throws', t => {
    var array = [1, 2, 3, 4, 5];
    for (const value in array) {
        t.true(value !== 'isUnique', 'isUnique');
        t.true(value !== 'getUnique', 'getUnique');
    }
    t.throws(() => Array.isUnique(), 'isUnique()');
    t.throws(() => Array.getUnique(), 'getUnique()');
    t.end();
});

function colorize(features, colors = ['#F00', '#00F', '#0F0', '#F0F', '#FFF'], width = 6) {
    const results = [];
    featureEach(features, (feature, index) => {
        const color = colors[index % colors.length];
        feature.properties = Object.assign({
            stroke: color,
            fill: color,
            'stroke-width': width,
            'fill-opacity': 0.5
        }, feature.properties);
        results.push(feature);
    });
    return featureCollection(results);
}
