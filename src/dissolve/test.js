import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import glob from 'glob'
import {polygon, point, featureCollection} from '../helpers';
import dissolve from './';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

test('turf-dissolve', t => {
    glob.sync(directories.in + '*.geojson').forEach(filepath => {
        const { name, base } = path.parse(filepath);
        const geojson = load.sync(filepath);

        const propertyName = geojson.propertyName;
        const results = dissolve(geojson, {propertyName});

        if (process.env.REGEN) write.sync(directories.out + base, results);
        t.deepEqual(results, load.sync(directories.out + base), name);
    })
    t.end();
});


test('dissolve -- throw', t => {
    const poly = polygon([[[-61,27],[-59,27],[-59,29],[-61,29],[-61,27]]]);
    const pt = point([-62,29]);

    t.throws(() => dissolve(null), /No featureCollection passed/, 'missing featureCollection');
    t.throws(() => dissolve(poly), /Invalid input to dissolve, FeatureCollection required/, 'invalid featureCollection');
    t.throws(() => dissolve(featureCollection([poly, pt])), /Invalid input to dissolve: must be a Polygon, given Point/, 'invalid collection type');
    t.end();
});