import fs from 'fs';
import test from 'tape';
import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import write from 'write-json-file';
import polygonSmooth from '.';

test('turf-polygon-smooth', t => {
    glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
        // Inputs
        const geojson = load.sync(filepath);
        const options = geojson.options || {};
        const iterations = options.iterations || 3;

        // Results
        const results = polygonSmooth(geojson, {iterations});

        // Save Results
        const out = filepath.replace(path.join('test', 'in'), path.join('test', 'out'))
        if (process.env.REGEN) write.sync(out, results);
        t.deepEqual(results, load.sync(out), path.parse(filepath).name);
    });
    t.end();
});
