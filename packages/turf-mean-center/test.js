import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import meanCenter from '.';

test('turf-mean-center -- unweighted', t => {
    const filepath = path.join(__dirname, 'test', 'in', 'four_points.json');
    const geojson = load.sync(filepath);
    const results = meanCenter(geojson);
    const out = filepath.replace(path.join('test', 'in', 'four_points.json'), path.join('test', 'out', 'four_points_unweighted.json'));
    if (process.env.REGEN) write.sync(out, results);
    t.deepEqual(results, load.sync(out));
    t.end();
});

test('turf-mean-center -- weighted', t => {
    const filepath = path.join(__dirname, 'test', 'in', 'four_points.json');
    const geojson = load.sync(filepath);
    const results = meanCenter(geojson, 'weight');
    const out = filepath.replace(path.join('test', 'in', 'four_points.json'), path.join('test', 'out', 'four_points_weighted.json'));
    if (process.env.REGEN) write.sync(out, results);
    t.deepEqual(results, load.sync(out));
    t.end();
});
