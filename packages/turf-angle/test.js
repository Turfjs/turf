import test from 'tape';
import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import write from 'write-json-file';
import { round } from '@turf/helpers';
import angle from './';

test('turf-voronoi', t => {
    glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
        // Input
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [start, mid, end] = geojson.features;

        // Results
        const results = {
            interiorAngle: angle(start, mid, end),
            exteriorAngle: angle(start, mid, end, {exterior: true}),
        };

        // Save results
        const out = filepath.replace(path.join('test', 'in'), path.join('test', 'out'));
        if (process.env.REGEN) write.sync(out, results);
        t.deepEqual(results, load.sync(out), name);
    });
    t.end();
});

test('turf-angle -- simple', t => {
    t.equal(round(angle([5, 5], [5, 6], [3, 4])), 45, '45 degrees');
    t.end();
});

test('turf-angle -- issues', t => {
    const start = [167.72709868848324, -45.56543836343071];
    const mid = [167.7269698586315, -45.56691059720167];
    const end = [167.72687866352499, -45.566989345276355];
    const a = angle(start, mid, end);

    t.false(isNaN(a), 'result is not NaN');
    t.end();
});
