import path from 'path';
import test from 'tape';
import glob from 'glob';
import load from 'load-json-file';
import write from 'write-json-file';
import { featureCollection, polygon } from '@turf/helpers';
import difference from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

test('turf-difference', t => {
    glob.sync(directories.in + '*.geojson').forEach(filepath => {
        const name = path.parse(filepath).name;
        const base = path.parse(filepath).base;
        const features = load.sync(filepath).features;
        const polygon1 = features[0];
        const polygon2 = features[1];

        const results = featureCollection([polygon1, polygon2]);

        const diff = difference(polygon1, polygon2);
        if (diff) {
            diff.properties = {'fill-opacity': 1};
            results.features.unshift(diff);
        }

        if (process.env.REGEN) write.sync(directories.out + base, results);
        t.deepEqual(results, load.sync(directories.out + base), name);
    });
    t.end();
});

test('turf-difference - support Geometry Objects', t => {
    const poly1 = polygon([[[121, -31], [144, -31], [144, -15], [121, -15], [121, -31]]]);
    const poly2 = polygon([[[126, -28], [140, -28], [140, -20], [126, -20], [126, -28]]]);

    t.assert(difference(poly1.geometry, poly2.geometry), 'geometry object support');
    t.end();
});

test('turf-difference - prevent input mutation', t => {
    const poly1 = polygon([[[121, -31], [144, -31], [144, -15], [121, -15], [121, -31]]]);
    const poly2 = polygon([[[126, -28], [140, -28], [140, -20], [126, -20], [126, -28]]]);
    const before1 = JSON.parse(JSON.stringify(poly1));
    const before2 = JSON.parse(JSON.stringify(poly2));

    difference(poly1, poly2);
    t.deepEqual(poly1, before1, 'polygon1 should not mutate');
    t.deepEqual(poly2, before2, 'polygon2 should not mutate');
    t.end();
});

test('turf-difference - complete overlap', t => {
    const poly = polygon([[[121, -31], [144, -31], [144, -15], [121, -15], [121, -31]]]);

    const result = difference(poly, poly);
    t.deepEqual(result, null, 'difference should be null');
    t.end();
});
