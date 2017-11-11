import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import geojsonhint from '@mapbox/geojsonhint';
import ellipse from '.';

test('turf-ellipse', t => {
    glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const xRadius = geojson.properties.xRadius;
        const yRadius = geojson.properties.yRadius;
        const steps = geojson.properties.steps;
        const units = geojson.properties.units;
        const results = ellipse(geojson, xRadius, yRadius, {steps: steps, units: units});

        const out = filepath.replace(path.join('test', 'in'), path.join('test', 'out'))
        if (process.env.REGEN) write.sync(out, results);
        t.deepEqual(results, load.sync(out), name);
    });
    t.end();
});

test('turf-ellipse -- with coordinates', t => {
    const center = [ -73.9975, 40.730833 ];
    const xRadius = 5;
    const yRadius = 1;
    const steps = 4;
    const results = ellipse(center, xRadius, yRadius, {steps: steps});
    const out = path.join(__dirname, 'test', 'out', 'nyc_bare.json');
    if (process.env.REGEN) write.sync(out, results);
    t.deepEqual(results, load.sync(out));
    t.end();
});

test('turf-ellipse -- validate geojson', t => {
  const E = ellipse([0, 0], 10, 20);
  geojsonhint.hint(E).forEach(hint => t.fail(hint.message));
  t.end();
});
