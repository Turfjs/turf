/*jshint esversion: 6 */
import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import kernelDensity from '.';

test('turf-kernel_density', t => {
  glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);

    const processed = kernelDensity(geojson);

    const results = styleResult(processed);
    const out = filepath.replace(path.join('test', 'in'), path.join('test', 'out'));
    if (process.env.REGEN) write.sync(out, results);
    t.deepEqual(results, load.sync(out), name);
  });
  t.end();
});
