import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import { point } from '@turf/helpers';
import { featureCollection } from '@turf/helpers';
import { featureEach } from '@turf/meta';
import concave from '.';

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

test('turf-concave', t => {
    fixtures.forEach(fixture => {
        const filename = fixture.filename;
        const name = fixture.name;
        const geojson = fixture.geojson;
        const properties = geojson.properties || {};
        const maxEdge = properties.maxEdge || 1;
        const units = properties.units;

        const hull = concave(geojson, maxEdge, {units: units});
        featureEach(geojson, stylePt);
        const results = featureCollection(geojson.features.concat(hull));

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    });
    t.end();
});


const points = featureCollection([point([0, 0]), point([1, 1]), point([1, 0])]);
const onePoint = featureCollection([point([0, 0])]);

test('concave -- throw', t => {
    t.equal(concave(onePoint, 5.5, {units: 'miles'}), null, 'too few polygons found to compute concave hull');
    t.equal(concave(onePoint, 0), null, 'too few polygons found to compute concave hull -- maxEdge too small');
    t.throws(() => concave(null, 0), /points is required/, 'no points');
    t.throws(() => concave(points, null), /maxEdge is required/, 'no maxEdge');
    t.throws(() => concave(points, 1, {units: 'foo'}), /units is invalid/, 'invalid units');

    t.end();
});

function stylePt(pt) {
    pt.properties['marker-color'] = '#f0f';
    pt.properties['marker-size'] = 'small';
}
