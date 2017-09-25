import glob from 'glob';
import path from 'path';
import test from 'tape';
import load from 'load-json-file';
import { lineString, polygon } from '@turf/helpers';
import booleanParallel from '.';

test('turf-boolean-parallel', t => {
    // True Fixtures
    glob.sync(path.join(__dirname, 'test', 'true', '**', '*.geojson')).forEach(filepath => {
        const name = path.parse(filepath).name;
        const geojson = load.sync(filepath);
        const line1 = geojson.features[0];
        const line2 = geojson.features[1];
        const result = booleanParallel(line1, line2);

        t.true(result, '[true] ' + name);
    });
    // False Fixtures
    glob.sync(path.join(__dirname, 'test', 'false', '**', '*.geojson')).forEach(filepath => {
        const name = path.parse(filepath).name;
        const geojson = load.sync(filepath);
        const line1 = geojson.features[0];
        const line2 = geojson.features[1];
        const result = booleanParallel(line1, line2);

        t.false(result, '[false] ' + name);
    });
    t.end();
});


test('turf-boolean-parallel -- throws', t => {
    const line = lineString([[0, 0], [0, 1]]);
    const poly = polygon([[[0, 0], [0, 1], [1, 1], [0, 0]]]);

    t.throws(() => booleanParallel(null, line), /line1 is required/, 'missing line1');
    t.throws(() => booleanParallel(line, null), /line2 is required/, 'missing line2');
    t.throws(() => booleanParallel(poly, line), /line1 must be a LineString/, 'different types');
    t.throws(() => booleanParallel(line, poly), /line2 must be a LineString/, 'different types');
    t.throws(() => booleanParallel({}, line), /Invalid GeoJSON object for line1/, 'invalid types');
    t.throws(() => booleanParallel(line, {}), /Invalid GeoJSON object for line2/, 'invalid types');

    t.end();
});
