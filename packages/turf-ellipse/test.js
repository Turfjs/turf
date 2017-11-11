const fs = require('fs-extra');
const test = require('tape');
const glob = require('glob');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const geojsonhint = require('@mapbox/geojsonhint');
const ellipse = require('.');

test('turf-ellipse', t => {
    glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const xAxis = geojson.properties.xAxis;
        const yAxis = geojson.properties.yAxis;
        const steps = geojson.properties.steps;
        const results = ellipse(geojson, xAxis, yAxis, {steps: steps});

        const out = filepath.replace(path.join('test', 'in'), path.join('test', 'out'))
        if (process.env.REGEN) write.sync(out, results);
        t.deepEqual(results, load.sync(out), name);
    });
    t.end();
});

test('turf-ellipse -- with coordinates', t => {
    const center = [ -73.9975, 40.730833 ];
    const xAxis = 5;
    const yAxis = 1;
    const steps = 4;
    const results = ellipse(center, xAxis, yAxis, {steps: steps});
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
