import fs from 'fs';
import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import {featureCollection, point, lineString} from '@turf/helpers';
import nearestPoint from './';

test('turf-nearest-point', t => {
    glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const points = load.sync(filepath);
        const targetPoint = point(points.properties.targetPoint);
        const nearestPt = nearestPoint(targetPoint, points);

        // Style results
        const lineProperties = {stroke: '#F00', 'stroke-width': 3, distanceToPoint: nearestPt.properties.distanceToPoint}
        const line = lineString([nearestPt.geometry.coordinates, targetPoint.geometry.coordinates], lineProperties)
        nearestPt.properties['marker-color'] = '#F00';
        nearestPt.properties['marker-symbol'] = 'star';
        targetPoint.properties['marker-color'] = '#00F';
        targetPoint.properties['marker-symbol'] = 'circle';
        const results = featureCollection([...points.features, line, targetPoint, nearestPt])

        // Save output
        const out = filepath.replace(path.join('test', 'in'), path.join('test', 'out'))
        if (process.env.REGEN) write.sync(out, results);
        t.deepEqual(results, load.sync(out), name);
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