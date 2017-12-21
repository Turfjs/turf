import test from 'tape';
import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import write from 'write-json-file';
import truncate from '@turf/truncate';
import { round, lineString, featureCollection } from '@turf/helpers';
import bearing from '@turf/bearing';
import distance from '@turf/distance';
import sector from '@turf/sector';
import angle from './';

test('turf-angle', t => {
    glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
        // Input
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [start, mid, end] = geojson.features;

        // Results
        const angleProperties = {
            interiorAngle: round(angle(start, mid, end), 6),
            interiorMercatorAngle: round(angle(start, mid, end, {mercator: true}), 6),
            explementary: false,
            fill: '#F00',
            stroke: '#F00',
            'fill-opacity': 0.3
        };
        const angleExplementaryProperties = {
            explementaryAngle: round(angle(start, mid, end, {explementary: true}), 6),
            explementaryMercatorAngle: round(angle(start, mid, end, {explementary: true, mercator: true}), 6),
            explementary: true,
            fill: '#00F',
            stroke: '#00F',
            'fill-opacity': 0.3
        }
        const results = featureCollection([
            truncate(sector(mid, distance(mid, start) / 3, bearing(mid, start), bearing(mid, end), {properties: angleProperties})),
            truncate(sector(mid, distance(mid, start) / 2, bearing(mid, end), bearing(mid, start), {properties: angleExplementaryProperties})),
            lineString([start.geometry.coordinates, mid.geometry.coordinates, end.geometry.coordinates], {'stroke-width': 4, stroke: '#222'}),
            start,
            mid,
            end,
        ])

        // Save results
        const out = filepath.replace(path.join('test', 'in'), path.join('test', 'out'));
        if (process.env.REGEN) write.sync(out, results);
        t.deepEqual(results, load.sync(out), name);
    });
    t.end();
});

test('turf-angle -- simple', t => {
    t.equal(round(angle([5, 5], [5, 6], [3, 4])), 45, '45 degrees');
    t.equal(round(angle([3, 4], [5, 6], [5, 5])), 45, '45 degrees -- inverse');
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
