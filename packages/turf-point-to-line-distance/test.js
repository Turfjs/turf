import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import circle from '@turf/circle';
import { point, lineString, round } from '@turf/helpers';
import pointToLineDistance from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('turf-point-to-line-distance', t => {
    const results = {};
    fixtures.forEach(fixture => {
        const filename = fixture.filename;
        const name = fixture.name;
        const geojson = fixture.geojson;
        const point = geojson.features[0];
        const line = geojson.features[1];
        const properties = geojson.properties || {};
        const units = properties.units || 'kilometers';
        const mercator = properties.mercator;

        // main method
        const options = {units: units, mercator: mercator};
        const distance = pointToLineDistance(point, line, options);

        // Store results
        results[name] = round(distance, 10);

        // debug purposes
        geojson.features.push(circle(point, distance, {steps: 200, units: units}));
        if (process.env.REGEN) write.sync(directories.out + filename, geojson);
    });
    if (process.env.REGEN) write.sync(directories.out + 'distances.json', results);
    t.deepEqual(load.sync(directories.out + 'distances.json'), results);
    t.end();
});

test('turf-point-to-line-distance -- throws', t => {
    const pt = point([0, 0]);
    const line = lineString([[1, 1], [-1, 1]]);

    t.throws(() => pointToLineDistance(null, line), /pt is required/, 'missing point');
    t.throws(() => pointToLineDistance(pt, null), /line is required/, 'missing line');
    t.throws(() => pointToLineDistance(pt, line, 'invalid'), /options is invalid/, 'invalid options');
    t.throws(() => pointToLineDistance(pt, line, {units: 'invalid'}), /units is invalid/, 'invalid units');
    t.throws(() => pointToLineDistance(line, line), /Invalid input to point: must be a Point, given LineString/, 'invalid line');
    t.throws(() => pointToLineDistance(pt, pt), /Invalid input to line: must be a LineString, given Point/, 'invalid point');

    t.end();
});

test('turf-point-to-line-distance -- Geometry', t => {
    const pt = point([0, 0]);
    const line = lineString([[1, 1], [-1, 1]]);

    t.assert(pointToLineDistance(pt.geometry, line.geometry));
    t.end();
});
