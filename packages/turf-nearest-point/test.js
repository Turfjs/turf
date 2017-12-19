import fs from 'fs';
import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import {featureCollection, point} from '@turf/helpers';
import nearestPoint from './';

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

test('turf-nearest-point', t => {
    fixtures.forEach(fixture => {
        const filename = fixture.filename;
        const name = fixture.name;
        const geojson = fixture.geojson;
        const targetPoint = point(geojson.properties.targetPoint);
        const nearestPt = nearestPoint(targetPoint, geojson);

        // Style results
        nearestPt.properties['marker-color'] = '#F00';
        nearestPt.properties['marker-symbol'] = 'star';
        targetPoint.properties['marker-color'] = '#00F';
        targetPoint.properties['marker-symbol'] = 'circle';
        const results = featureCollection([...geojson.features, targetPoint, nearestPt]);

        // Save output
        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    });
    t.end();
});

test('nearest-point -- prevent input mutation', t => {
    const pt1 = point([40, 50], {featureIndex: 'foo'})
    const pt2 = point([20, -10], {distanceToPoint: 'bar'})
    const pts = featureCollection([pt1, pt2]);
    const nearestPt = nearestPoint([0, 0], pts)

    // Check if featureIndex properties was added to properties
    t.equal(nearestPt.properties.featureIndex, 1)

    // Check if previous input points have been modified
    t.deepEqual(pt1.properties, {featureIndex: 'foo'})
    t.deepEqual(pt2.properties, {distanceToPoint: 'bar'})
    t.end();
})