const path = require('path');
const test = require('tape');
const glob = require('glob');
const load = require('load-json-file');
const write = require('write-json-file');
const {featureCollection, polygon} = require('@turf/helpers');
const difference = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

test('turf-difference', t => {
    glob.sync(directories.in + '*.geojson').forEach(filepath => {
        const {base, name} = path.parse(filepath);
        const [polygon1, polygon2] = load.sync(filepath).features;
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
    t.deepEqual(poly1, before1, 'polygon1 shoult not mutate');
    t.deepEqual(poly2, before2, 'polygon2 shoult not mutate');
    t.end();
});
